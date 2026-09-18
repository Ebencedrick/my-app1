const pricingNotes = [
  { name: "Platform fee", value: "5% on campaign spend", description: "Applied only when a user funds and launches a campaign." },
  { name: "Public pricing", value: "Hidden", description: "No public plan is shown on the landing or pricing pages." },
  { name: "Access model", value: "Free signup", description: "Users can create an account and explore without a plan selection." },
];

export default function AdminPricingPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-pink-300">Monetization</p>
        <h1 className="mt-2 text-4xl font-bold text-white">Pricing model</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {pricingNotes.map((item) => (
          <div key={item.name} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-sm text-slate-400">{item.name}</p>
            <p className="mt-4 text-2xl font-bold text-white">{item.value}</p>
            <p className="mt-3 text-sm text-slate-300">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
