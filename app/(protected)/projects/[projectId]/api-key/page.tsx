import ApiKeyCard from "./api-key-card";

type ApiKeyPageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

export default async function ApiKeyPage({
  params,
}: ApiKeyPageProps) {
  const { projectId } = await params;

  return <ApiKeyCard projectId={projectId} />;
}