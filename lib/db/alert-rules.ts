import { AlertMetric, Severity } from "@/app/generated/prisma/enums";
import { prisma } from "./prisma";

export type CreateAlertRuleInput = {
  projectId: string;
  name: string;
  description?: string;
  metric: AlertMetric;
  threshold: number;
  duration?: number;
  severity: Severity;
};

export async function createAlertRule(data: CreateAlertRuleInput) {
  return prisma.alertRule.create({
    data: {
      projectId: data.projectId,
      name: data.name,
      description: data.description,
      metric: data.metric,
      threshold: data.threshold,
      duration: data.duration,
      severity: data.severity,
    },
  });
}

export async function getProjectAlertRules(projectId: string) {
  return prisma.alertRule.findMany({
    where: {
      projectId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getAlertRule(ruleId: string, projectId: string) {
  return prisma.alertRule.findFirst({
    where: {
      id: ruleId,
      projectId,
    },
  });
}

export async function updateAlertRule(
  ruleId: string,
  projectId: string,
  data: Partial<CreateAlertRuleInput> & {
    enabled?: boolean;
  },
) {
  return prisma.alertRule.updateMany({
    where: {
      id: ruleId,
      projectId,
    },
    data,
  });
}

export async function deleteAlertRule(ruleId: string, projectId: string) {
  return prisma.alertRule.deleteMany({
    where: {
      id: ruleId,
      projectId,
    },
  });
}
