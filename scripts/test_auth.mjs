import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import fs from "fs";
import path from "path";

// Read .env.local
const envPath = path.resolve(process.cwd(), ".env.local");
let uri = process.env.MONGODB_URI;
let jwtSecret = process.env.JWT_SECRET || "default_super_secret_jwt_key_ads_platform_dev";

if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    if (line.startsWith("MONGODB_URI=")) {
      uri = line.slice("MONGODB_URI=".length).trim();
    }
    if (line.startsWith("JWT_SECRET=")) {
      jwtSecret = line.slice("JWT_SECRET=".length).trim();
    }
  }
}

const secretKey = new TextEncoder().encode(jwtSecret);

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String },
    phone: { type: String, trim: true },
    businessName: { type: String, trim: true },
    industry: { type: String, trim: true },
    website: { type: String, trim: true },
    campaignGoal: { type: String, trim: true },
    audience: { type: String, trim: true },
    budget: { type: String, trim: true },
    platformFocus: [{ type: String, trim: true }],
    role: { type: String, enum: ["user", "admin"], default: "user" },
    planId: { type: String, default: "pay_as_you_go" },
    kycStatus: {
      type: String,
      enum: ["unverified", "pending", "verified", "rejected"],
      default: "unverified",
    },
    kycDocumentName: { type: String, trim: true },
    phoneVerified: { type: Boolean, default: false },
    onboardingComplete: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const WalletSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    currency: { type: String, default: "USD", uppercase: true },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);
const Wallet = mongoose.models.Wallet || mongoose.model("Wallet", WalletSchema);

async function run() {
  console.log("--- STARTING AUTOMATED AUTH & PERSISTENCE TESTS ---");
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    console.log("✓ Connected to MongoDB Atlas.");

    const testEmail = `test_runner_${Date.now()}@example.com`;
    const testPass = "SecretP@ss123";

    // 1. Password Hashing Test
    console.log("\n[TEST 1] Testing bcrypt password hashing and comparison...");
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(testPass, salt);
    const isCorrect = await bcrypt.compare(testPass, hash);
    const isIncorrect = await bcrypt.compare("WrongPassword", hash);

    if (isCorrect && !isIncorrect) {
      console.log("✓ Password hashing & verification test passed.");
    } else {
      throw new Error("Password verification failed!");
    }

    // 2. JWT Generation & Verification Test
    console.log("\n[TEST 2] Testing jose JWT session token generation & verification...");
    const dummyUserId = new mongoose.Types.ObjectId().toString();
    const token = await new SignJWT({ userId: dummyUserId, email: testEmail, role: "user" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secretKey);

    const { payload } = await jwtVerify(token, secretKey);
    if (payload.userId === dummyUserId && payload.email === testEmail && payload.role === "user") {
      console.log("✓ JWT creation & verification test passed.");
    } else {
      throw new Error("JWT payload mismatch!");
    }

    // 3. User Registration & Wallet Creation in MongoDB
    console.log(`\n[TEST 3] Creating user in MongoDB: ${testEmail}...`);
    const newUser = await User.create({
      email: testEmail,
      password: hash,
      phone: "+1234567890",
      role: "user",
      onboardingComplete: false,
      kycStatus: "unverified",
      phoneVerified: false,
    });
    console.log("✓ User created with ID:", newUser._id.toString());

    // Create wallet
    const newWallet = await Wallet.create({
      userId: newUser._id,
      currency: "USD",
    });
    console.log("✓ Associated Wallet created with ID:", newWallet._id.toString());

    // 4. Test User Authentication Query
    console.log("\n[TEST 4] Simulating login query...");
    const fetchedUser = await User.findOne({ email: testEmail });
    if (!fetchedUser) throw new Error("Could not find newly created user!");
    const loginOk = await bcrypt.compare(testPass, fetchedUser.password);
    if (!loginOk) throw new Error("Login password comparison failed!");
    console.log("✓ Login credentials verified successfully against MongoDB record.");

    // 5. Test Brand Introduction & Onboarding Updates
    console.log("\n[TEST 5] Testing brand introduction and onboarding data persistence in MongoDB Atlas...");
    const updated = await User.findByIdAndUpdate(
      newUser._id,
      {
        businessName: "Amiri Luxury Wears",
        industry: "Fashion & Apparel",
        website: "https://amiristore.com",
        campaignGoal: "Promoting luxury designer wear autumn collection 2026",
        audience: "Young adults 20-35 interested in fashion in Yaounde and Douala",
        budget: "$500 - $1,000",
        platformFocus: ["Instagram", "TikTok", "Facebook"],
        phoneVerified: true,
        kycStatus: "pending",
        kycDocumentName: "business_registration_rcm.pdf",
        onboardingComplete: true,
        planId: "pay_as_you_go",
      },
      { new: true }
    );

    if (
      updated.businessName === "Amiri Luxury Wears" &&
      updated.industry === "Fashion & Apparel" &&
      updated.website === "https://amiristore.com" &&
      updated.campaignGoal === "Promoting luxury designer wear autumn collection 2026" &&
      updated.audience === "Young adults 20-35 interested in fashion in Yaounde and Douala" &&
      updated.budget === "$500 - $1,000" &&
      updated.platformFocus.length === 3 &&
      updated.phoneVerified === true &&
      updated.kycStatus === "pending" &&
      updated.kycDocumentName === "business_registration_rcm.pdf" &&
      updated.onboardingComplete === true
    ) {
      console.log("✓ Brand introduction and onboarding data persisted 100% successfully in MongoDB Atlas.");
    } else {
      throw new Error("Brand introduction fields failed to persist properly!");
    }

    // 6. Cleanup
    console.log("\n[CLEANUP] Cleaning up test records...");
    await Wallet.deleteOne({ userId: newUser._id });
    await User.deleteOne({ _id: newUser._id });
    console.log("✓ Test records cleaned up successfully.");

    await mongoose.disconnect();
    console.log("\n ALL TESTS PASSED SUCCESSFULLY! MongoDB Auth & Persistence is fully functional.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Test failed:", err);
    process.exit(1);
  }
}

run();
