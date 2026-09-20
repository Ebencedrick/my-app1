import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";
import connectToDatabase from "@/lib/db";
import SupportTicket from "@/models/SupportTicket";

export const dynamic = "force-dynamic";

const DEFAULT_TICKETS = [
  {
    userEmail: "amina@brandlabs.af",
    userName: "Amina Kofi",
    subject: "Need help tracking a failed campaign launch",
    message: "Our Facebook campaign status shows pending review for over 3 hours. We have an upcoming product launch tomorrow and need this active urgently.",
    status: "open",
    priority: "high",
    replies: [],
  },
  {
    userEmail: "nadia@glowstudio.ke",
    userName: "Nadia Wambui",
    subject: "Questions about withdrawal timing & PDF receipts",
    message: "Hello team, can we export consolidated PDF receipts for our tax filing in Nairobi? Also checking when unused hold release reflects in statement.",
    status: "in_progress",
    priority: "medium",
    replies: [
      {
        senderRole: "admin",
        senderName: "Operations Desk",
        message: "Hi Nadia! Consolidated billing statements can be downloaded under Billing. Hold releases reflect immediately in your transaction ledger.",
        createdAt: new Date(Date.now() - 3600000),
      },
    ],
  },
  {
    userEmail: "daniel@westretail.io",
    userName: "Daniel Mensah",
    subject: "Report issue with ad account connection",
    message: "We observed a momentary timeout while uploading 1080x1920 video creative for TikTok ad set.",
    status: "resolved",
    priority: "low",
    replies: [
      {
        senderRole: "admin",
        senderName: "AdPlatform Tech",
        message: "We verified and optimized chunked media streaming. Your campaign uploaded cleanly and is running.",
        createdAt: new Date(Date.now() - 86400000),
      },
    ],
  },
];

export async function GET(request: Request) {
  try {
    const auth = await verifyAdmin(request);
    if (!auth.authorized) return auth.response;

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status");
    const priorityFilter = searchParams.get("priority");

    const query: Record<string, any> = {};
    if (statusFilter && statusFilter !== "all") query.status = statusFilter;
    if (priorityFilter && priorityFilter !== "all") query.priority = priorityFilter;

    let tickets = await SupportTicket.find(query).sort({ createdAt: -1 }).lean();

    if ((!tickets || tickets.length === 0) && (!statusFilter || statusFilter === "all")) {
      await SupportTicket.insertMany(DEFAULT_TICKETS);
      tickets = await SupportTicket.find(query).sort({ createdAt: -1 }).lean();
    }

    return NextResponse.json({ tickets });
  } catch (error: any) {
    console.error("Admin GET support tickets error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch support tickets" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const auth = await verifyAdmin(request);
    if (!auth.authorized) return auth.response;

    const body = await request.json();
    const { ticketId, message, senderName = "Support Admin" } = body;

    if (!ticketId || !message) {
      return NextResponse.json(
        { error: "ticketId and message are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const ticket = await SupportTicket.findById(ticketId);
    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    ticket.replies.push({
      senderRole: "admin",
      senderName,
      message: message.trim(),
      createdAt: new Date(),
    });

    if (ticket.status === "open") {
      ticket.status = "in_progress";
    }

    await ticket.save();

    return NextResponse.json({
      message: "Reply added successfully",
      ticket,
    });
  } catch (error: any) {
    console.error("Admin POST ticket reply error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to add reply" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const auth = await verifyAdmin(request);
    if (!auth.authorized) return auth.response;

    const body = await request.json();
    const { ticketId, status, priority } = body;

    if (!ticketId) {
      return NextResponse.json({ error: "ticketId is required" }, { status: 400 });
    }

    await connectToDatabase();

    const updates: Record<string, any> = {};
    if (status) {
      const validStatuses = ["open", "in_progress", "resolved", "closed"];
      if (!validStatuses.includes(status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }
      updates.status = status;
    }

    if (priority) {
      const validPriorities = ["low", "medium", "high", "urgent"];
      if (!validPriorities.includes(priority)) {
        return NextResponse.json({ error: "Invalid priority" }, { status: 400 });
      }
      updates.priority = priority;
    }

    const ticket = await SupportTicket.findByIdAndUpdate(ticketId, updates, { new: true });
    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Ticket updated successfully",
      ticket,
    });
  } catch (error: any) {
    console.error("Admin PATCH ticket error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update ticket" },
      { status: 500 }
    );
  }
}
