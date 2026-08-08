import { Badge } from "@/components/ui/badge";
import { LogLevel } from "@/app/generated/prisma/client";

const variants: Record<LogLevel, "default" | "secondary" | "destructive" | "outline"> = {
  TRACE: "outline",
  DEBUG: "secondary",
  INFO: "default",
  WARN: "secondary",
  ERROR: "destructive",
  FATAL: "destructive",
};

export function LevelBadge({ level }: { level: LogLevel }) {
  return <Badge variant={variants[level]}>{level}</Badge>;
}
