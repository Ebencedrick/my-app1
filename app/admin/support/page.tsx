const tickets = [
  { user: "Amina Kofi", issue: "Need help tracking a failed campaign launch", status: "Open", priority: "High" },
  { user: "Nadia Wambui", issue: "Questions about withdrawal timing", status: "In progress", priority: "Medium" },
  { user: "Daniel Mensah", issue: "Report issue with ad account connection", status: "Resolved", priority: "Low" },
];

export default function AdminSupportPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-pink-300">Operations</p>
        <h1 className="mt-2 text-4xl font-bold text-white">Support queue</h1>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-950/80 text-slate-300">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Issue</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.user + ticket.issue} className="border-t border-slate-800 text-slate-200">
                <td className="px-4 py-4 text-white">{ticket.user}</td>
                <td className="px-4 py-4 text-slate-300">{ticket.issue}</td>
                <td className="px-4 py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      ticket.priority === "High"
                        ? "bg-red-500/10 text-red-300"
                        : ticket.priority === "Medium"
                          ? "bg-yellow-500/10 text-yellow-300"
                          : "bg-emerald-500/10 text-emerald-300"
                    }`}
                  >
                    {ticket.priority}
                  </span>
                </td>
                <td className="px-4 py-4 text-slate-300">{ticket.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
