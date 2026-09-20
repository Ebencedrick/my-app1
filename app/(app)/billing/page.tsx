"use client";

import { useState, useEffect } from "react";
import { X, Download, FileText, Loader2, Sparkles } from "lucide-react";

interface InvoiceItem {
  id: string;
  date: string;
  type: "campaign" | "deposit";
  description: string;
  amount: number;
  status: string;
  items: Array<{ description: string; amount: number }>;
}

const defaultInvoices: InvoiceItem[] = [
  {
    id: "INV-SMP-001",
    date: new Date().toISOString(),
    type: "campaign",
    description: "Welcome Campaign Sample",
    amount: 50.0,
    status: "paid",
    items: [
      { description: "Ad Campaign Budget (5 days × $10/day)", amount: 50.0 },
    ],
  },
];

export default function BillingPage() {
  const [invoices, setInvoices] = useState<InvoiceItem[]>(defaultInvoices);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceItem | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    async function loadBillingData() {
      try {
        setLoading(true);
        const [campRes, txRes] = await Promise.all([
          fetch("/api/campaigns"),
          fetch("/api/wallet/transactions?limit=20"),
        ]);

        const items: InvoiceItem[] = [];

        if (campRes.ok) {
          const campData = await campRes.json();
          if (campData.campaigns && campData.campaigns.length > 0) {
            campData.campaigns.forEach((c: any) => {
              const adSpend = c.totalAdSpend || c.dailyBudget * c.days || 0;
              const fee = c.managementFee || Number((adSpend * 0.05).toFixed(2));
              const total = c.totalCharge || adSpend + fee;

              items.push({
                id: `INV-${c._id.slice(-6).toUpperCase()}`,
                date: c.createdAt || new Date().toISOString(),
                type: "campaign",
                description: `${c.name || "Ad"} Campaign`,
                amount: adSpend,
                status: c.status === "completed" ? "paid" : c.status === "active" ? "active" : "pending",
                items: [
                  { description: `Ad Campaign Spend (${c.days || 7} days × $${c.dailyBudget || 10}/day)`, amount: adSpend },
                ],
              });
            });
          }
        }

        if (txRes.ok) {
          const txData = await txRes.json();
          if (txData.transactions && txData.transactions.length > 0) {
            txData.transactions
              .filter((t: any) => t.type === "deposit")
              .forEach((t: any) => {
                items.push({
                  id: `DEP-${t._id.slice(-6).toUpperCase()}`,
                  date: t.createdAt,
                  type: "deposit",
                  description: `${t.gateway ? t.gateway.toUpperCase() : "Wallet"} Deposit`,
                  amount: t.amount,
                  status: "paid",
                  items: [
                    { description: `Wallet Balance Credit (${t.gateway ? t.gateway.toUpperCase() : "MoMo"})`, amount: t.amount },
                  ],
                });
              });
          }
        }

        if (items.length > 0) {
          // Sort chronologically newest first
          items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          setInvoices(items);
        }
      } catch (err) {
        console.error("Failed to load billing data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadBillingData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "text-green-400";
      case "active":
        return "text-emerald-400";
      case "pending":
        return "text-yellow-400";
      case "overdue":
        return "text-red-400";
      default:
        return "text-slate-400";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const viewInvoiceDetails = (invoice: InvoiceItem) => {
    setSelectedInvoice(invoice);
    setShowDetailsModal(true);
  };

  const downloadPDF = (invoice: InvoiceItem) => {
    const invoiceContent = `
INVOICE / RECEIPT
==================
Reference ID: ${invoice.id}
Date: ${formatDate(invoice.date)}
Status: ${invoice.status.toUpperCase()}

Description: ${invoice.description}
Category: ${invoice.type.toUpperCase()}

BREAKDOWN:
${invoice.items.map((item) => `* ${item.description}: $${item.amount.toFixed(2)}`).join("\n")}

TOTAL: $${invoice.amount.toFixed(2)}

Platform: Social Ad Management Platform (Model B Reseller)
All ad spend is executed directly on verified Meta & TikTok Business accounts.
Thank you for your business!
    `.trim();

    const blob = new Blob([invoiceContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${invoice.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="mb-6">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Billing & Invoices</h1>
        <p className="text-base text-slate-400">Track campaign spend and download receipts for your platform fee.</p>
      </div>

      <div className="bg-gradient-to-r from-pink-600 to-orange-600 rounded-2xl p-6 text-white mb-6 shadow-2xl shadow-pink-500/25">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-pink-100 mb-2 text-sm font-medium">Access Tier</p>
            <p className="text-3xl md:text-4xl font-bold mb-1">Free Lifetime Access</p>
            <p className="text-pink-200 text-sm">No monthly recurring fee or subscription plans. You only pay for your ad budget.</p>
          </div>
          <div className="rounded-xl bg-white/10 px-4 py-3 backdrop-blur-sm border border-white/15">
            <div className="text-xs uppercase tracking-[0.18em] text-pink-100">Monthly Plan Fee</div>
            <div className="text-2xl font-bold">$0 / Free</div>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Invoice History</h2>
          {loading && (
            <div className="flex items-center gap-2 text-xs text-pink-400">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Syncing with ledger...</span>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Invoice ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Description</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-xs font-mono font-medium text-white">{invoice.id}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-400">{formatDate(invoice.date)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div>
                      <span className="text-xs text-white font-medium">{invoice.description}</span>
                      <span className="block text-xs text-slate-400 capitalize">{invoice.type}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs font-semibold text-white">${invoice.amount.toFixed(2)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`text-xs font-medium capitalize ${getStatusColor(invoice.status)}`}>{invoice.status}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs font-medium">
                    <div className="flex gap-3">
                      <button onClick={() => viewInvoiceDetails(invoice)} className="text-pink-400 hover:text-pink-300 transition-colors">View Details</button>
                      <button onClick={() => downloadPDF(invoice)} className="text-slate-400 hover:text-white transition-colors">Download</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showDetailsModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Invoice Details</h2>
              <button onClick={() => setShowDetailsModal(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-slate-700">
                <span className="text-slate-400 text-sm">Invoice ID</span>
                <span className="text-white font-mono font-medium text-sm">{selectedInvoice.id}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-700">
                <span className="text-slate-400 text-sm">Date</span>
                <span className="text-white font-medium text-sm">{formatDate(selectedInvoice.date)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-700">
                <span className="text-slate-400 text-sm">Status</span>
                <span className={`text-white font-medium text-sm capitalize ${getStatusColor(selectedInvoice.status)}`}>{selectedInvoice.status}</span>
              </div>
              <div className="py-2 border-b border-slate-700">
                <span className="text-slate-400 text-sm block mb-2">Itemized Breakdown</span>
                <div className="space-y-2">
                  {selectedInvoice.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-slate-300">{item.description}</span>
                      <span className="text-white font-medium">${item.amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center py-2.5 bg-gradient-to-r from-pink-500/10 to-orange-500/10 rounded-lg px-4 border border-pink-500/20">
                <span className="text-white font-semibold text-sm">Total</span>
                <span className="text-pink-400 font-bold text-lg">${selectedInvoice.amount.toFixed(2)}</span>
              </div>
            </div>

            <button onClick={() => downloadPDF(selectedInvoice)} className="w-full mt-6 py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-xl font-semibold hover:from-pink-400 hover:to-orange-400 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25">
              <Download className="w-4 h-4" />
              Download Receipt (.txt)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
