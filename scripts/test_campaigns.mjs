import mongoose from "mongoose";
import fs from "fs";
import path from "path";

// Read .env.local
const envPath = path.resolve(process.cwd(), ".env.local");
let uri = process.env.MONGODB_URI;

if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    if (line.startsWith("MONGODB_URI=")) {
      uri = line.slice("MONGODB_URI=".length).trim();
      break;
    }
  }
}

if (!uri) {
  console.error("No MONGODB_URI found");
  process.exit(1);
}

// Schemas
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String },
});

const WalletSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    currency: { type: String, default: "USD", uppercase: true },
  },
  { timestamps: true }
);

const LedgerEntrySchema = new mongoose.Schema(
  {
    walletId: { type: mongoose.Schema.Types.ObjectId, ref: "Wallet", required: true, index: true },
    type: {
      type: String,
      enum: ["deposit", "hold", "settlement", "holdRelease", "refund"],
      required: true,
    },
    amount: { type: Number, required: true },
    currency: { type: String, default: "USD", uppercase: true },
    gateway: { type: String, enum: ["momo", "crypto"] },
    gatewayRef: { type: String },
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign" },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "cancelled"],
      default: "completed",
    },
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

const CampaignSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true },
    objective: { type: String, required: true },
    platforms: [{ type: String }],
    status: {
      type: String,
      enum: ["draft", "pending", "in_review", "active", "paused", "completed", "rejected"],
      default: "pending",
    },
    dailyBudget: { type: Number, required: true },
    days: { type: Number, required: true },
    totalAdSpend: { type: Number, required: true },
    managementFee: { type: Number, required: true },
    totalCharge: { type: Number, required: true },
    startDate: { type: Date },
    endDate: { type: Date },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);
const Wallet = mongoose.models.Wallet || mongoose.model("Wallet", WalletSchema);
const LedgerEntry = mongoose.models.LedgerEntry || mongoose.model("LedgerEntry", LedgerEntrySchema);
const Campaign = mongoose.models.Campaign || mongoose.model("Campaign", CampaignSchema);

async function getWalletBalanceSummary(walletId) {
  const entries = await LedgerEntry.aggregate([
    { $match: { walletId: new mongoose.Types.ObjectId(walletId), status: "completed" } },
    { $group: { _id: "$type", total: { $sum: "$amount" }, count: { $sum: 1 } } },
  ]);

  const map = { deposit: 0, hold: 0, holdRelease: 0, settlement: 0, refund: 0 };
  for (const item of entries) {
    if (map[item._id] !== undefined) {
      map[item._id] = item.total;
    }
  }

  const activeHold = Math.max(0, map.hold - map.settlement - map.holdRelease);
  const availableBalance = Math.max(0, map.deposit + map.refund - map.hold + map.holdRelease);

  return {
    availableBalance: Number(availableBalance.toFixed(2)),
    activeHold: Number(activeHold.toFixed(2)),
    totalDeposited: Number(map.deposit.toFixed(2)),
  };
}

async function placeCampaignHold({ walletId, campaignId, amount }) {
  const balance = await getWalletBalanceSummary(walletId);
  if (balance.availableBalance < amount) {
    return { success: false, reason: "Insufficient available balance" };
  }
  const entry = await LedgerEntry.create({
    walletId,
    campaignId,
    type: "hold",
    amount,
    currency: "USD",
    status: "completed",
    metadata: { reason: "Campaign budget reservation" },
  });
  return { success: true, entry };
}

async function releaseCampaignHold({ walletId, campaignId, amount }) {
  const entry = await LedgerEntry.create({
    walletId,
    campaignId,
    type: "holdRelease",
    amount,
    currency: "USD",
    status: "completed",
    metadata: { reason: "Campaign stopped early by user" },
  });
  return { success: true, entry };
}

async function runTests() {
  console.log("\n========================================================");
  console.log("   CAMPAIGN LIFECYCLE & LEDGER HOLD VERIFICATION SUITE  ");
  console.log("========================================================\n");

  await mongoose.connect(uri);
  console.log("Connected to MongoDB Atlas.");

  // 1. Setup test user and wallet
  let user = await User.findOne({ email: "campaign_lifecycle_test@reseller.local" });
  if (!user) {
    user = await User.create({
      email: "campaign_lifecycle_test@reseller.local",
      name: "Campaign Lifecycle Tester",
    });
  }

  let wallet = await Wallet.findOne({ userId: user._id });
  if (!wallet) {
    wallet = await Wallet.create({ userId: user._id });
  }

  // Clean prior entries for clean run
  await LedgerEntry.deleteMany({ walletId: wallet._id });
  await Campaign.deleteMany({ userId: user._id });

  // 2. Initial Deposit: $150.00
  console.log("\n1. Seeding wallet with initial deposit ($150.00)...");
  await LedgerEntry.create({
    walletId: wallet._id,
    type: "deposit",
    amount: 150.00,
    currency: "USD",
    status: "completed",
    gateway: "momo",
    gatewayRef: "DEP_INITIAL_150",
  });

  let balance = await getWalletBalanceSummary(wallet._id);
  console.log(`Initial Available Balance: $${balance.availableBalance.toFixed(2)} | Active Hold: $${balance.activeHold.toFixed(2)}`);
  if (balance.availableBalance !== 150) throw new Error("Expected initial balance 150");
  console.log("  PASS: Initial deposit registered correctly.");

  // 3. Test Insufficient Balance Check
  console.log("\n2. Testing Insufficient Balance Protection ($200 campaign cost > $150 balance)...");
  const failedHold = await placeCampaignHold({
    walletId: wallet._id,
    campaignId: new mongoose.Types.ObjectId(),
    amount: 200.00,
  });
  if (failedHold.success === false && failedHold.reason.includes("Insufficient")) {
    console.log(`  PASS: Overdraft successfully blocked. Reason: '${failedHold.reason}'`);
  } else {
    throw new Error("Expected overdraft rejection");
  }

  // 4. Create Campaign with Valid Balance ($10/day x 5 days = $50 + $2.50 fee = $52.50)
  console.log("\n3. Creating Campaign ($52.50 total charge)...");
  const campaign = await Campaign.create({
    userId: user._id,
    name: "Black Friday Sale 2026",
    objective: "traffic_engagement",
    platforms: ["facebook", "instagram", "tiktok"],
    status: "pending",
    dailyBudget: 10,
    days: 5,
    totalAdSpend: 50.00,
    managementFee: 2.50,
    totalCharge: 52.50,
    startDate: new Date(),
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
  });

  const holdResult = await placeCampaignHold({
    walletId: wallet._id,
    campaignId: campaign._id,
    amount: campaign.totalCharge,
  });
  if (!holdResult.success) throw new Error("Hold placement failed");

  balance = await getWalletBalanceSummary(wallet._id);
  console.log(`Post-Hold Available Balance: $${balance.availableBalance.toFixed(2)} (Expected $97.50)`);
  console.log(`Post-Hold Active Hold: $${balance.activeHold.toFixed(2)} (Expected $52.50)`);
  if (balance.availableBalance !== 97.50 || balance.activeHold !== 52.50) {
    throw new Error("Post-hold balance mismatch");
  }
  console.log("  PASS: Campaign hold successfully placed and subtracted from available balance.");

  // 5. Test Campaign Status Update: Pause and Resume
  console.log("\n4. Testing Campaign Pause & Resume operations...");
  campaign.status = "paused";
  await campaign.save();
  let fetchedCampaign = await Campaign.findById(campaign._id);
  if (fetchedCampaign.status !== "paused") throw new Error("Expected campaign status paused");
  console.log(`  Status transitioned to: ${fetchedCampaign.status}`);

  campaign.status = "active";
  await campaign.save();
  fetchedCampaign = await Campaign.findById(campaign._id);
  if (fetchedCampaign.status !== "active") throw new Error("Expected campaign status active");
  console.log(`  Status transitioned to: ${fetchedCampaign.status}`);
  console.log("  PASS: Pause and Resume transitions verified.");

  // 6. Test Stop Campaign & Release Hold
  console.log("\n5. Testing Early Stop & Ledger Hold Release...");
  campaign.status = "completed";
  campaign.endDate = new Date();
  await campaign.save();

  // Find unused hold
  const entries = await LedgerEntry.find({
    walletId: wallet._id,
    campaignId: campaign._id,
    status: "completed",
  });
  let totalHold = 0, totalSettled = 0, totalReleased = 0;
  for (const e of entries) {
    if (e.type === "hold") totalHold += e.amount;
    if (e.type === "settlement") totalSettled += e.amount;
    if (e.type === "holdRelease") totalReleased += e.amount;
  }
  const unusedHold = Math.max(0, Number((totalHold - totalSettled - totalReleased).toFixed(2)));
  console.log(`Unused hold calculated: $${unusedHold.toFixed(2)}`);

  await releaseCampaignHold({
    walletId: wallet._id,
    campaignId: campaign._id,
    amount: unusedHold,
  });

  balance = await getWalletBalanceSummary(wallet._id);
  console.log(`Post-Release Available Balance: $${balance.availableBalance.toFixed(2)} (Expected $150.00)`);
  console.log(`Post-Release Active Hold: $${balance.activeHold.toFixed(2)} (Expected $0.00)`);
  if (balance.availableBalance !== 150.00 || balance.activeHold !== 0) {
    throw new Error("Hold release balance calculation failed");
  }
  console.log("  PASS: Unspent hold fully refunded back into available balance upon campaign stop.");

  // 7. Cleanup
  console.log("\n6. Cleaning up test artifacts...");
  await Campaign.deleteOne({ _id: campaign._id });
  await LedgerEntry.deleteMany({ walletId: wallet._id });
  await Wallet.deleteOne({ _id: wallet._id });
  await User.deleteOne({ _id: user._id });
  console.log("  PASS: Cleaned up test records.");

  console.log("\n========================================================");
  console.log("   ALL 6 CAMPAIGN & LEDGER HOLD TESTS PASSED!          ");
  console.log("========================================================\n");

  await mongoose.disconnect();
}

runTests().catch((err) => {
  console.error("Test Suite Failed:", err);
  process.exit(1);
});
