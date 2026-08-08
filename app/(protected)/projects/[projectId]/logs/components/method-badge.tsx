import { Method } from "@/app/generated/prisma/client";
import { Badge } from "@/components/ui/badge";

type Props = {
  method: Method;
};

const variants: Record<Method, "default" | "secondary" | "destructive" | "outline"> = {
  GET: "default",
  POST: "secondary",
  PUT: "outline",
  PATCH: "outline",
  DELETE: "destructive",
};

export function MethodBadge({ method }: Props) {
  return <Badge variant={variants[method]}>{method}</Badge>;
}
