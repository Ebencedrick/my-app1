import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import SupportTicket from "@/models/SupportTicket";
import User from "@/models/User";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const sessionUser = await getSessionUser();
    const { searchParams } = new URL(request.url);
    const emailParam = searchParams.get("email");

    const email = sessionUser?.email || emailParam;
    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const ticket = await SupportTicket.findOne({
      userEmail: email.toLowerCase().trim(),
    }).sort({ updatedAt: -1 });

    return NextResponse.json({
      ticket: ticket || null,
      unreadByUser: ticket?.unreadByUser || false,
    });
  } catch (error: any) {
    console.error("GET user support error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to load support chat" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const sessionUser = await getSessionUser();
    const body = await request.json();
    const { message, email: fallbackEmail, subject = "Live Chat Support" } = body;

    const email = sessionUser?.email || fallbackEmail;
    if (!email || !message || !message.trim()) {
      return NextResponse.json(
        { error: "Email and message content are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check if there is an existing active ticket
    let ticket = await SupportTicket.findOne({
      userEmail: email.toLowerCase().trim(),
      status: { $in: ["open", "in_progress"] },
    }).sort({ updatedAt: -1 });

    const senderName = sessionUser?.businessName || sessionUser?.email || email;

    if (ticket) {
      ticket.replies.push({
        senderRole: "user",
        senderName,
        message: message.trim(),
        createdAt: new Date(),
      });
      ticket.unreadByAdmin = true;
      ticket.unreadByUser = false;
      ticket.status = "open";
      await ticket.save();
    } else {
      ticket = await SupportTicket.create({
        userId: sessionUser?._id,
        userEmail: email.toLowerCase().trim(),
        userName: senderName,
        subject: subject.trim(),
        message: message.trim(),
        status: "open",
        priority: "medium",
        unreadByAdmin: true,
        unreadByUser: false,
        replies: [],
      });
    }

    return NextResponse.json({
      success: true,
      ticket,
    });
  } catch (error: any) {
    console.error("POST user support message error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send message" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const sessionUser = await getSessionUser();
    const body = await request.json();
    const { ticketId, email: fallbackEmail } = body;

    await connectToDatabase();

    const query: Record<string, any> = {};
    if (ticketId) query._id = ticketId;
    else if (sessionUser?.email || fallbackEmail) {
      query.userEmail = (sessionUser?.email || fallbackEmail).toLowerCase().trim();
    } else {
      return NextResponse.json({ error: "Missing identifier" }, { status: 400 });
    }

    await SupportTicket.updateMany(query, { $set: { unreadByUser: false } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("PATCH mark support read error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to mark as read" },
      { status: 500 }
    );
  }
}
