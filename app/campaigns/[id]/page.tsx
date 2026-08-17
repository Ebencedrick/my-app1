import { useParams } from "next/navigation";

export default function CampaignDetailPage() {
  const params = useParams();
  const id = params?.id || "unknown";

  return (
    <main>
      <h1>Campaign {id}</h1>
      <p>Detail view: charts, metrics, creative preview (placeholder)</p>
    </main>
  );
}
