import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/session";
import { Plus } from "lucide-react";
import Link from "next/link";
import { ProjectsList } from "./project-list";

export default async function ProjectsPage() {
  const session = await getServerSession();

  if(!session){
    throw new Error("Unauthorized");
  }

  const projects = await prisma.project.findMany({
    where:{
      ownerId: session.user.id
    },
    orderBy:{
      createdAt:'desc'
    }
  })
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

     {projects.length === 0 ? (
  <Card className="border-dashed">
    <CardHeader>
      <CardTitle>No projects yet</CardTitle>
      <CardDescription>
        Create your first project to start collecting telemetry and monitor your
        application's performance.
      </CardDescription>
    </CardHeader>

    <CardContent>
      <Link href="/projects/new">
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Project
        </Button>
      </Link>
    </CardContent>
  </Card>
) : (
  <ProjectsList projects={projects} />
)}
    </div>
  );
}