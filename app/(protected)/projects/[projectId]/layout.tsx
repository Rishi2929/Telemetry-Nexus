import Link from "next/link";

import { Button } from "@/components/ui/button";

type Props = {
  children: React.ReactNode;
  params: Promise<{
    projectId: string;
  }>;
};

export default async function ProjectLayout({ children, params }: Props) {
  const { projectId } = await params;

  return (
    <div className="min-w-0 max-w-full space-y-8">
      <div className="flex flex-wrap gap-2 border-b pb-4">
        <Button variant="ghost">
          <Link href={`/projects/${projectId}`}>Overview</Link>
        </Button>

        <Button variant="ghost">
          <Link href={`/projects/${projectId}/logs`}>Logs</Link>
        </Button>

        <Button variant="ghost">
          <Link href={`/projects/${projectId}/analytics`}>Analytics</Link>
        </Button>

        <Button variant="ghost">
          <Link href={`/projects/${projectId}/api-key`}>API Keys</Link>
        </Button>

        <Button variant="ghost">
          <Link href={`/projects/${projectId}/edit`}>Settings</Link>
        </Button>
      </div>

      {children}
    </div>
  );
}
