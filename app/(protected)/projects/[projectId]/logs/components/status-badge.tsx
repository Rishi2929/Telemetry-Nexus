import { Badge } from "@/components/ui/badge";

type Props = {
  statusCode: number;
};

function getVariant(statusCode: number): "default" | "secondary" | "destructive" | "outline" {
  if (statusCode >= 500) {
    return "destructive";
  }

  if (statusCode >= 400) {
    return "secondary";
  }

  if (statusCode >= 300) {
    return "outline";
  }

  return "default";
}

export function StatusBadge({ statusCode }: Props) {
  return <Badge variant={getVariant(statusCode)}>{statusCode}</Badge>;
}
