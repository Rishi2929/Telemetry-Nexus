import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function ProjectsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground mt-1">
            Manage your monitored applications.
          </p>
        </div>

       <Link href="/projects/new">
        <Button className="cursor-pointer">
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
       </Link>
      </div>

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>No projects yet</CardTitle>
          <CardDescription>
            Create your first project to start collecting telemetry and monitor
            your application's performance.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Link href="/projects/new">
          <Button className="cursor-pointer">
            <Plus className="mr-2 h-4 w-4" />
            Create Project
          </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}