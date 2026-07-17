import PathDetailClient from "@/components/psap-portal/PathDetailClient";

export default function PathDetailPage({
  params,
}: {
  params: { pathId: string };
}) {
  return <PathDetailClient pathId={params.pathId} />;
}
