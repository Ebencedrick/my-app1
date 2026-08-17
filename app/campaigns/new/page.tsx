"use client"

import { useSearchParams } from "next/navigation";

export default function CampaignWizardPage() {
  const params = useSearchParams();
  const step = params?.get("step") || "promoting";

  return (
    <main>
      <h1>Create Campaign — Wizard</h1>
      <p>Current step: {step}</p>
      <p>Wizard UI lives here (single-route wizard using ?step=...)</p>
    </main>
  );
}
