import { NextResponse } from "next/server";

import { getServerSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { createAlertRule } from "@/lib/db/alert-rules";

import { AlertMetric, Severity } from "@/app/generated/prisma/enums";

type RouteContext = {
  params: Promise<{
    projectId: string;
  }>;
};

export async function POST(request: Request, { params }: RouteContext) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await params;

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      ownerId: session.user.id,
    },
    select: {
      id: true,
    },
  });

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const body = await request.json();

  const { name, metric, threshold, severity } = body;

  if (typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  if (!Object.values(AlertMetric).includes(metric)) {
    return NextResponse.json({ error: "Invalid metric" }, { status: 400 });
  }

  if (typeof threshold !== "number" || threshold < 0) {
    return NextResponse.json({ error: "Invalid threshold" }, { status: 400 });
  }

  if (!Object.values(Severity).includes(severity)) {
    return NextResponse.json({ error: "Invalid severity" }, { status: 400 });
  }

  const rule = await createAlertRule({
    projectId,
    name: name.trim(),
    metric,
    threshold,
    severity,
  });

  return NextResponse.json(rule, {
    status: 201,
  });
}
