import mongoose from "mongoose";
import connectToDatabase from "@/lib/db";
import Wallet, { IWallet } from "@/models/Wallet";
import LedgerEntry, { ILedgerEntry, LedgerEntryType } from "@/models/LedgerEntry";

export interface WalletBalanceSummary {
  walletId: string;
  currency: string;
  totalBalance: number;
  availableBalance: number;
  activeHold: number;
  totalDeposited: number;
  totalSettled: number;
  totalRefunded: number;
}

/**
 * Ensures a wallet exists for the given user ID.
 */
export async function ensureUserWallet(userId: string | mongoose.Types.ObjectId): Promise<IWallet> {
  await connectToDatabase();
  const uid = typeof userId === "string" ? new mongoose.Types.ObjectId(userId) : userId;

  let wallet = await Wallet.findOne({ userId: uid });
  if (!wallet) {
    wallet = await Wallet.create({
      userId: uid,
      currency: "USD",
    });
  }
  return wallet;
}

/**
 * Dynamically aggregates completed LedgerEntries to derive the true wallet balance.
 */
export async function getWalletBalanceSummary(
  walletId: string | mongoose.Types.ObjectId
): Promise<WalletBalanceSummary> {
  await connectToDatabase();
  const wid = typeof walletId === "string" ? new mongoose.Types.ObjectId(walletId) : walletId;

  const wallet = await Wallet.findById(wid);
  const currency = wallet?.currency || "USD";

  // Aggregate completed ledger entries grouped by type
  const entries = await LedgerEntry.aggregate([
    {
      $match: {
        walletId: wid,
        status: "completed",
      },
    },
    {
      $group: {
        _id: "$type",
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
  ]);

  const map: Record<LedgerEntryType, number> = {
    deposit: 0,
    hold: 0,
    holdRelease: 0,
    settlement: 0,
    refund: 0,
  };

  for (const item of entries) {
    if (item._id in map) {
      map[item._id as LedgerEntryType] = Number(item.total) || 0;
    }
  }

  const totalDeposited = Number(map.deposit.toFixed(2));
  const totalHolds = Number(map.hold.toFixed(2));
  const totalHoldReleases = Number(map.holdRelease.toFixed(2));
  const totalSettled = Number(map.settlement.toFixed(2));
  const totalRefunded = Number(map.refund.toFixed(2));

  // Active holds are holds placed minus releases and settlements applied
  const activeHold = Math.max(0, Number((totalHolds - totalHoldReleases - totalSettled).toFixed(2)));

  // Total balance = deposits + refunds - settlements
  const totalBalance = Math.max(0, Number((totalDeposited + totalRefunded - totalSettled).toFixed(2)));

  // Available balance = total balance - active holds
  const availableBalance = Math.max(0, Number((totalBalance - activeHold).toFixed(2)));

  return {
    walletId: wid.toString(),
    currency,
    totalBalance,
    availableBalance,
    activeHold,
    totalDeposited,
    totalSettled,
    totalRefunded,
  };
}

/**
 * Records a deposit ledger entry into MongoDB.
 */
export async function recordDeposit(params: {
  walletId: string | mongoose.Types.ObjectId;
  amount: number;
  gateway?: "momo" | "crypto";
  gatewayRef?: string;
  metadata?: Record<string, any>;
}): Promise<ILedgerEntry> {
  await connectToDatabase();
  const wid = typeof params.walletId === "string" ? new mongoose.Types.ObjectId(params.walletId) : params.walletId;

  if (params.amount <= 0) {
    throw new Error("Deposit amount must be greater than zero");
  }

  return LedgerEntry.create({
    walletId: wid,
    type: "deposit",
    amount: Number(params.amount.toFixed(2)),
    currency: "USD",
    gateway: params.gateway || "momo",
    gatewayRef: params.gatewayRef || `DEP_${Date.now()}`,
    status: "completed",
    metadata: params.metadata || {},
  });
}

/**
 * Places a campaign hold on the wallet if available balance is sufficient.
 */
export async function placeCampaignHold(params: {
  walletId: string | mongoose.Types.ObjectId;
  campaignId?: string | mongoose.Types.ObjectId;
  amount: number;
  metadata?: Record<string, any>;
}): Promise<{ success: boolean; entry?: ILedgerEntry; error?: string }> {
  await connectToDatabase();
  const wid = typeof params.walletId === "string" ? new mongoose.Types.ObjectId(params.walletId) : params.walletId;
  const holdAmount = Number(params.amount.toFixed(2));

  if (holdAmount <= 0) {
    return { success: false, error: "Hold amount must be greater than zero" };
  }

  const summary = await getWalletBalanceSummary(wid);
  if (summary.availableBalance < holdAmount) {
    return {
      success: false,
      error: `Insufficient available funds. Required: $${holdAmount.toFixed(2)}, Available: $${summary.availableBalance.toFixed(2)}`,
    };
  }

  const entry = await LedgerEntry.create({
    walletId: wid,
    type: "hold",
    amount: holdAmount,
    currency: "USD",
    campaignId: params.campaignId
      ? typeof params.campaignId === "string"
        ? new mongoose.Types.ObjectId(params.campaignId)
        : params.campaignId
      : undefined,
    status: "completed",
    metadata: params.metadata || {},
  });

  return { success: true, entry };
}

/**
 * Releases unspent funds from a campaign hold.
 */
export async function releaseCampaignHold(params: {
  walletId: string | mongoose.Types.ObjectId;
  campaignId?: string | mongoose.Types.ObjectId;
  amount: number;
  reason?: string;
}): Promise<ILedgerEntry> {
  await connectToDatabase();
  const wid = typeof params.walletId === "string" ? new mongoose.Types.ObjectId(params.walletId) : params.walletId;
  const releaseAmount = Number(params.amount.toFixed(2));

  return LedgerEntry.create({
    walletId: wid,
    type: "holdRelease",
    amount: releaseAmount,
    currency: "USD",
    campaignId: params.campaignId
      ? typeof params.campaignId === "string"
        ? new mongoose.Types.ObjectId(params.campaignId)
        : params.campaignId
      : undefined,
    status: "completed",
    metadata: { reason: params.reason || "Campaign finished / remaining hold released" },
  });
}

/**
 * Records a spend settlement deduction against a wallet / campaign.
 */
export async function recordSettlement(params: {
  walletId: string | mongoose.Types.ObjectId;
  campaignId?: string | mongoose.Types.ObjectId;
  amount: number;
  metadata?: Record<string, any>;
}): Promise<ILedgerEntry> {
  await connectToDatabase();
  const wid = typeof params.walletId === "string" ? new mongoose.Types.ObjectId(params.walletId) : params.walletId;
  const settlementAmount = Number(params.amount.toFixed(2));

  return LedgerEntry.create({
    walletId: wid,
    type: "settlement",
    amount: settlementAmount,
    currency: "USD",
    campaignId: params.campaignId
      ? typeof params.campaignId === "string"
        ? new mongoose.Types.ObjectId(params.campaignId)
        : params.campaignId
      : undefined,
    status: "completed",
    metadata: params.metadata || {},
  });
}

/**
 * Fetches recent chronological transaction history for a wallet.
 */
export async function getWalletTransactions(
  walletId: string | mongoose.Types.ObjectId,
  limit = 50,
  skip = 0
): Promise<ILedgerEntry[]> {
  await connectToDatabase();
  const wid = typeof walletId === "string" ? new mongoose.Types.ObjectId(walletId) : walletId;

  return LedgerEntry.find({ walletId: wid })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
}
