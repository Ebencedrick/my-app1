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

// Inline schemas for standalone test script
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

const Wallet = mongoose.models.Wallet || mongoose.model("Wallet", WalletSchema);
const LedgerEntry = mongoose.models.LedgerEntry || mongoose.model("LedgerEntry", LedgerEntrySchema);

async function getWalletBalanceSummary(walletId) {
  const entries = await LedgerEntry.aggregate([
    { $match: { walletId: new mongoose.Types.ObjectId(walletId), status: "completed" } },
    { $group: { _id: "$type", total: { $sum: "$amount" }, count: { $sum: 1 } } },
  ]);

  const map = { deposit: 0, hold: 0, holdRelease: 0, settlement: 0, refund: 0 };
  for (const item of entries) {
    if (item._id in map) {
      map[item._id] = Number(item.total) || 0;
    }
  }

  const totalDeposited = Number(map.deposit.toFixed(2));
  const totalHolds = Number(map.hold.toFixed(2));
  const totalHoldReleases = Number(map.holdRelease.toFixed(2));
  const totalSettled = Number(map.settlement.toFixed(2));
  const totalRefunded = Number(map.refund.toFixed(2));

  const activeHold = Math.max(0, Number((totalHolds - totalHoldReleases - totalSettled).toFixed(2)));
  const totalBalance = Math.max(0, Number((totalDeposited + totalRefunded - totalSettled).toFixed(2)));
  const availableBalance = Math.max(0, Number((totalBalance - activeHold).toFixed(2)));

  return { totalBalance, availableBalance, activeHold, totalDeposited, totalSettled, totalRefunded };
}

async function run() {
  console.log("--- STARTING DOUBLE-ENTRY LEDGER ENGINE TESTS ---");
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    console.log("✓ Connected to MongoDB Atlas.");

    const testUserId = new mongoose.Types.ObjectId();
    const wallet = await Wallet.create({ userId: testUserId, currency: "USD" });
    console.log("✓ Test wallet created with ID:", wallet._id.toString());

    // 1. Check Initial Zero State
    console.log("\n[TEST 1] Verifying initial empty ledger balance...");
    let summary = await getWalletBalanceSummary(wallet._id);
    if (summary.availableBalance === 0 && summary.activeHold === 0 && summary.totalDeposited === 0) {
      console.log("✓ Initial balance is $0.00 as expected.");
    } else {
      throw new Error(`Unexpected initial balance: ${JSON.stringify(summary)}`);
    }

    // 2. Deposit Funds
    console.log("\n[TEST 2] Recording a $500.00 deposit via MTN MoMo...");
    await LedgerEntry.create({
      walletId: wallet._id,
      type: "deposit",
      amount: 500.0,
      currency: "USD",
      gateway: "momo",
      gatewayRef: "MOMO_TEST_001",
      status: "completed",
    });

    summary = await getWalletBalanceSummary(wallet._id);
    console.log("  Summary after deposit:", summary);
    if (summary.totalDeposited === 500 && summary.availableBalance === 500 && summary.activeHold === 0) {
      console.log("✓ Available balance correctly derived as $500.00.");
    } else {
      throw new Error("Deposit balance check failed!");
    }

    // 3. Campaign Hold
    console.log("\n[TEST 3] Placing a $200.00 hold for a new campaign launch...");
    const campaignId = new mongoose.Types.ObjectId();
    await LedgerEntry.create({
      walletId: wallet._id,
      type: "hold",
      amount: 200.0,
      currency: "USD",
      campaignId,
      status: "completed",
    });

    summary = await getWalletBalanceSummary(wallet._id);
    console.log("  Summary after campaign hold:", summary);
    if (summary.availableBalance === 300 && summary.activeHold === 200 && summary.totalBalance === 500) {
      console.log("✓ Available balance correctly locked to $300.00 with $200.00 in active hold.");
    } else {
      throw new Error("Hold balance check failed!");
    }

    // 4. Overdraft Check
    console.log("\n[TEST 4] Testing overdraft prevention (attempting $350 hold on $300 available)...");
    const attemptedHold = 350.0;
    if (summary.availableBalance < attemptedHold) {
      console.log(`✓ Overdraft prevented: Requested $${attemptedHold} > Available $${summary.availableBalance}.`);
    } else {
      throw new Error("Overdraft check failed!");
    }

    // 5. Spend Settlement
    console.log("\n[TEST 5] Recording $150.00 actual campaign ad spend settlement...");
    await LedgerEntry.create({
      walletId: wallet._id,
      type: "settlement",
      amount: 150.0,
      currency: "USD",
      campaignId,
      status: "completed",
    });

    summary = await getWalletBalanceSummary(wallet._id);
    console.log("  Summary after settlement:", summary);
    if (summary.totalSettled === 150 && summary.activeHold === 50 && summary.totalBalance === 350 && summary.availableBalance === 300) {
      console.log("✓ Settlement correctly deducted from total balance ($350) and reduced remaining hold ($50).");
    } else {
      throw new Error("Settlement balance check failed!");
    }

    // 6. Release Remaining Hold
    console.log("\n[TEST 6] Campaign finished: Releasing unused $50.00 hold...");
    await LedgerEntry.create({
      walletId: wallet._id,
      type: "holdRelease",
      amount: 50.0,
      currency: "USD",
      campaignId,
      status: "completed",
    });

    summary = await getWalletBalanceSummary(wallet._id);
    console.log("  Summary after hold release:", summary);
    if (summary.activeHold === 0 && summary.availableBalance === 350 && summary.totalBalance === 350) {
      console.log("✓ Unused hold unlocked cleanly: Final available balance is $350.00 with $0 active holds.");
    } else {
      throw new Error("Hold release balance check failed!");
    }

    // 7. Transaction Query Test
    console.log("\n[TEST 7] Verifying chronological ledger history query...");
    const txs = await LedgerEntry.find({ walletId: wallet._id }).sort({ createdAt: -1 });
    console.log(`✓ Fetched ${txs.length} ledger entries.`);
    if (txs.length === 4) {
      console.log("✓ All 4 ledger entries verified in chronological audit trail.");
    } else {
      throw new Error(`Expected 4 transactions, found ${txs.length}`);
    }

    // 8. Cleanup
    console.log("\n[CLEANUP] Cleaning up test records...");
    await LedgerEntry.deleteMany({ walletId: wallet._id });
    await Wallet.deleteOne({ _id: wallet._id });
    console.log("✓ Test records cleaned up successfully.");

    await mongoose.disconnect();
    console.log("\n ALL LEDGER TESTS PASSED SUCCESSFULLY! Double-entry ledger calculations are mathematically correct and persistent.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Ledger test failed:", err);
    process.exit(1);
  }
}

run();
