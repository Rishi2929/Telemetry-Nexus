import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProjectWithApiKeys } from "@/lib/types/type";
import { RegenerateApiKeyDialog } from "./regenerate-api-key-dialog";

type ApiKeyManagementCardProps = {
  projectId: string;
  apiKey?: ProjectWithApiKeys["apiKeys"][number];
};

export function ApiKeyManagementCard({ projectId, apiKey }: ApiKeyManagementCardProps) {
  // console.log("ApiKeyManagementCard projectId:", projectId);
  if (!apiKey) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>No API key found for this project.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Keys</CardTitle>
        <CardDescription>Manage your project's API credentials.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-1">
          <p className="text-sm font-medium">Primary Key</p>

          <p className="font-mono text-sm text-muted-foreground">tn_live_********************************</p>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium">Created</p>

          <p className="text-sm text-muted-foreground">
            {apiKey.createdAt.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
      </CardContent>

      <CardFooter className="justify-end">
        <RegenerateApiKeyDialog projectId={projectId} />
      </CardFooter>
    </Card>
  );
}
