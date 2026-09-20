import mongoose from "mongoose";
import bcrypt from "bcryptjs";
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

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String },
    phone: { type: String, trim: true },
    businessName: { type: String, trim: true },
    industry: { type: String, trim: true },
    website: { type: String, trim: true },
    role: { type: String, default: "user" },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function runTests() {
  console.log("\n========================================================");
  console.log("   USER CREDENTIALS UPDATE VERIFICATION SUITE           ");
  console.log("========================================================\n");

  await mongoose.connect(uri);
  console.log("Connected to MongoDB Atlas.");

  const testEmail = "cred_tester_initial@reseller.local";
  const updatedEmail = "cred_tester_updated@reseller.local";
  const collisionEmail = "cred_tester_collision@reseller.local";

  // Clean prior test artifacts
  await User.deleteMany({ email: { $in: [testEmail, updatedEmail, collisionEmail] } });

  // 1. Create a collision user
  await User.create({
    email: collisionEmail,
    businessName: "Collision Corp",
    password: await bcrypt.hash("temp12345", 10),
  });

  // 2. Create target test user with initial credentials
  console.log("\n1. Creating test user with initial credentials...");
  const initialHashedPassword = await bcrypt.hash("InitialPassword123!", 10);
  const user = await User.create({
    email: testEmail,
    password: initialHashedPassword,
    phone: "+237 670 000 000",
    businessName: "Old Business Name",
    industry: "E-commerce",
    website: "https://oldbrand.com",
  });
  console.log(`  User created with ID: ${user._id}`);
  console.log(`  Initial email: ${user.email}`);

  // 3. Test Profile & Contact credential update
  console.log("\n2. Updating contact and business credentials in MongoDB...");
  user.phone = "+237 690 999 888";
  user.businessName = "Apex Global Retail";
  user.industry = "Technology";
  user.website = "https://apexretail.global";
  await user.save();

  let fetched = await User.findById(user._id);
  if (
    fetched.phone !== "+237 690 999 888" ||
    fetched.businessName !== "Apex Global Retail" ||
    fetched.industry !== "Technology" ||
    fetched.website !== "https://apexretail.global"
  ) {
    throw new Error("Contact & business credentials were not properly saved");
  }
  console.log("  PASS: Profile credentials successfully updated in MongoDB Atlas.");

  // 4. Test Email update
  console.log("\n3. Testing email credential update...");
  user.email = updatedEmail;
  await user.save();

  fetched = await User.findById(user._id);
  if (fetched.email !== updatedEmail) {
    throw new Error("Email was not updated");
  }
  console.log(`  PASS: Email updated to ${fetched.email} in MongoDB Atlas.`);

  // 5. Test Email collision detection
  console.log("\n4. Testing email collision detection...");
  let collisionDetected = false;
  try {
    const existing = await User.findOne({ email: collisionEmail, _id: { $ne: user._id } });
    if (existing) {
      collisionDetected = true;
    }
  } catch (e) {
    //
  }
  if (collisionDetected) {
    console.log("  PASS: Email duplicate collision successfully caught.");
  } else {
    throw new Error("Expected collision was not detected");
  }

  // 6. Test Password verification & update
  console.log("\n5. Testing Password credential update with bcrypt verification...");
  // Wrong current password attempt
  const isOldPasswordMatch = await bcrypt.compare("WrongPassword!", user.password);
  if (isOldPasswordMatch) {
    throw new Error("Wrong password should not match");
  }
  console.log("  PASS: Incorrect current password rejected.");

  // Correct current password verified
  const isCorrectOld = await bcrypt.compare("InitialPassword123!", user.password);
  if (!isCorrectOld) {
    throw new Error("Initial password should match");
  }

  // Update to new password
  const newHash = await bcrypt.hash("BrandNewPassword999!", 10);
  user.password = newHash;
  await user.save();

  fetched = await User.findById(user._id);
  const isNewMatch = await bcrypt.compare("BrandNewPassword999!", fetched.password);
  const isOldMatchAfterUpdate = await bcrypt.compare("InitialPassword123!", fetched.password);

  if (isNewMatch && !isOldMatchAfterUpdate) {
    console.log("  PASS: New password successfully hashed and persisted in MongoDB Atlas.");
    console.log("  PASS: Old password no longer authenticates.");
  } else {
    throw new Error("Password update verification failed");
  }

  // 7. Cleanup
  console.log("\n6. Cleaning up test records...");
  await User.deleteMany({ email: { $in: [testEmail, updatedEmail, collisionEmail] } });
  console.log("  PASS: Test cleanup complete.");

  console.log("\n========================================================");
  console.log("   ALL 5 CREDENTIAL TESTS PASSED IN ATLAS!              ");
  console.log("========================================================\n");

  await mongoose.disconnect();
}

runTests().catch((err) => {
  console.error("Test Suite Failed:", err);
  process.exit(1);
});
