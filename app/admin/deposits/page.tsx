const deposits = [
  { user: "Amina Kofi", method: "MoMo", amount: "$1,200", status: "Confirmed", time: "09:42 AM" },
  { user: "Daniel Mensah", method: "Bank", amount: "$860", status: "Pending", time: "Yesterday" },
  { user: "Nadia Wambui", method: "MoMo", amount: "$2,400", status: "Confirmed", time: "Yesterday" },
  { user: "Kehinde Bello", method: "Card", amount: "$330", status: "Flagged", time: "2 days ago" },
];

export default function AdminDepositsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-pink-300">Finance</p>
        <h1 className="mt-2 text-4xl font-bold text-white">Deposits</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <p className="text-sm text-slate-400">Total deposits</p>
          <p className="mt-4 text-3xl font-bold text-white">$38.4K</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <p className="text-sm text-slate-400">Pending</p>
          <p className="mt-4 text-3xl font-bold text-white">$4.2K</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <p className="text-sm text-slate-400">Failed</p>
          <p className="mt-4 text-3xl font-bold text-white">$780</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-950/80 text-slate-300">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Method</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Time</th>
            </tr>
          </thead>
          <tbody>
            {deposits.map((item) => (
              <tr key={item.user + item.time} className="border-t border-slate-800 text-slate-200">
                <td className="px-4 py-4">{item.user}</td>
                <td className="px-4 py-4">{item.method}</td>
                <td className="px-4 py-4 text-white">{item.amount}</td>
                <td className="px-4 py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      item.status === "Confirmed"
                        ? "bg-emerald-500/10 text-emerald-300"
                        : item.status === "Pending"
                          ? "bg-yellow-500/10 text-yellow-300"
                          : "bg-red-500/10 text-red-300"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-slate-400">{item.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
