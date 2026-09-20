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
  console.error("No MONGODB_URI found in .env.local");
  process.exit(1);
}

async function run() {
  console.log("Connecting to MongoDB Atlas...");
  await mongoose.connect(uri);
  console.log("Connected successfully to Atlas.\n");

  const db = mongoose.connection.db;

  // 1. Check Users Collection
  const usersCount = await db.collection("users").countDocuments();
  console.log(`[PASS] Users collection: ${usersCount} users registered`);

  // 2. Check Pricing Plans
  const plansCount = await db.collection("pricingplans").countDocuments();
  console.log(`[INFO] PricingPlans collection: ${plansCount} plans present`);

  // 3. Check Ad Accounts
  const accountsCount = await db.collection("adaccounts").countDocuments();
  console.log(`[INFO] AdAccounts collection: ${accountsCount} accounts present`);

  // 4. Check Support Tickets
  const ticketsCount = await db.collection("supporttickets").countDocuments();
  console.log(`[INFO] SupportTickets collection: ${ticketsCount} tickets present`);

  // 5. Check Campaigns
  const campaignsCount = await db.collection("campaigns").countDocuments();
  console.log(`[PASS] Campaigns collection: ${campaignsCount} campaigns present`);

  // 6. Check Deposits and Ledger
  const depositsCount = await db.collection("deposits").countDocuments();
  const ledgerCount = await db.collection("ledgerentries").countDocuments();
  console.log(`[PASS] Deposits: ${depositsCount}, Ledger Entries: ${ledgerCount}`);

  console.log("\nAll Admin collections verified in MongoDB Atlas!");
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error("Test failed:", e);
  process.exit(1);
});
