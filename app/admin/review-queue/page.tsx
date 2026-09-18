const queue = [
  { brand: "Glow Studio", reason: "Ad copy flagged for policy risk", priority: "High", status: "Pending review" },
  { brand: "Nexa Retail", reason: "Creative needs brand compliance check", priority: "Medium", status: "Escalated" },
  { brand: "Westpeak Foods", reason: "Budget exceeds policy threshold", priority: "High", status: "Pending review" },
  { brand: "Blaq Haus", reason: "Video asset missing approved caption", priority: "Low", status: "In progress" },
];

export default function AdminReviewQueuePage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-pink-300">Moderation</p>
        <h1 className="mt-2 text-4xl font-bold text-white">Review queue</h1>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-950/80 text-slate-300">
            <tr>
              <th className="px-4 py-3">Brand</th>
              <th className="px-4 py-3">Reason</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {queue.map((item) => (
              <tr key={item.brand} className="border-t border-slate-800 text-slate-200">
                <td className="px-4 py-4 font-medium text-white">{item.brand}</td>
                <td className="px-4 py-4 text-slate-300">{item.reason}</td>
                <td className="px-4 py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      item.priority === "High"
                        ? "bg-red-500/10 text-red-300"
                        : item.priority === "Medium"
                          ? "bg-yellow-500/10 text-yellow-300"
                          : "bg-emerald-500/10 text-emerald-300"
                    }`}
                  >
                    {item.priority}
                  </span>
                </td>
                <td className="px-4 py-4 text-slate-300">{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
