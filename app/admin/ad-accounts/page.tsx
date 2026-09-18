const adAccounts = [
  { name: "Meta Business Manager", status: "Healthy", spend: "$15K", health: "91%" },
  { name: "TikTok Business Center", status: "Needs attention", spend: "$8.4K", health: "73%" },
  { name: "Instagram Ad Account", status: "Healthy", spend: "$12.1K", health: "94%" },
  { name: "LinkedIn Campaigns", status: "Paused", spend: "$1.3K", health: "61%" },
];

export default function AdminAdAccountsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-pink-300">Accounts</p>
        <h1 className="mt-2 text-4xl font-bold text-white">Ad accounts</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {adAccounts.map((account) => (
          <div key={account.name} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-medium text-white">{account.name}</p>
              <span
                className={`rounded-full px-2 py-1 text-xs ${
                  account.status === "Healthy"
                    ? "bg-emerald-500/10 text-emerald-300"
                    : account.status === "Needs attention"
                      ? "bg-yellow-500/10 text-yellow-300"
                      : "bg-slate-500/10 text-slate-300"
                }`}
              >
                {account.status}
              </span>
            </div>
            <p className="text-sm text-slate-400">Spend capacity</p>
            <p className="mt-2 text-2xl font-bold text-white">{account.spend}</p>
            <div className="mt-4">
              <div className="mb-2 flex justify-between text-xs text-slate-400">
                <span>Account health</span>
                <span>{account.health}</span>
              </div>
              <div className="h-2 rounded-full bg-slate-800">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-pink-500 to-orange-500"
                  style={{ width: account.health }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
