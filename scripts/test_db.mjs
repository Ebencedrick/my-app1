import mongoose from "mongoose";
import fs from "fs";
import path from "path";

// Read .env.local manually
const envPath = path.resolve(process.cwd(), ".env.local");
let uri = process.env.MONGODB_URI;

if (!uri && fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    if (line.startsWith("MONGODB_URI=")) {
      uri = line.slice("MONGODB_URI=".length).trim();
      break;
    }
  }
}

console.log("Testing connection with URI (masked):", uri ? uri.replace(/:([^:@]+)@/, ":****@") : "NONE");

async function run() {
  try {
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    console.log(" SUCCESS! Connected to MongoDB Atlas cluster.");
    console.log("Database Name:", conn.connection.name);
    console.log("Cluster Host:", conn.connection.host);
    const ping = await conn.connection.db.admin().ping();
    console.log("Ping response from MongoDB:", JSON.stringify(ping));
    await mongoose.disconnect();
    console.log("Disconnected cleanly.");
    process.exit(0);
  } catch (err) {
    console.error(" Connection error:", err.message);
    process.exit(1);
  }
}

run();
