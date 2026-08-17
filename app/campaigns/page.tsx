import Link from "next/link";

export default function CampaignsPage() {
  return (
    <main>
      <h1>Campaigns</h1>
      <p>List view placeholder</p>
      <p>
        <Link href="/campaigns/new">Create new campaign</Link>
      </p>
    </main>
  );
}
