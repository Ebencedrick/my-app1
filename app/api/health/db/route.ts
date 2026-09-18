import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import mongoose from "mongoose";
import "@/models"; // Ensure all models are registered

export const dynamic = "force-dynamic";

export async function GET() {
  const startTime = Date.now();
  try {
    const conn = await connectToDatabase();
    
    // Ping the MongoDB database to ensure full read/write network connectivity
    const pingResult = await conn.connection.db?.admin().ping();
    const durationMs = Date.now() - startTime;

    const stateMap: Record<number, string> = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    };

    return NextResponse.json({
      status: "connected",
      state: stateMap[conn.connection.readyState] || "unknown",
      database: conn.connection.name,
      host: conn.connection.host,
      latencyMs: durationMs,
      ping: pingResult,
      registeredModels: Object.keys(mongoose.models),
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    const durationMs = Date.now() - startTime;
    return NextResponse.json(
      {
        status: "error",
        error: error.message || "Failed to connect to MongoDB",
        latencyMs: durationMs,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
