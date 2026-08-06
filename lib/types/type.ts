import { Prisma } from "@/app/generated/prisma/client";

export type ProjectWithApiKeys = Prisma.ProjectGetPayload<{
  include: {
    apiKeys: true;
  };
}>;
