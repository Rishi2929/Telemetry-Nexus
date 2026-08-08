import { ApiLog } from "@/app/generated/prisma/client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { MethodBadge } from "./method-badge";
import { StatusBadge } from "./status-badge";
import { LevelBadge } from "./levelBadge";

type Props = {
  logs: ApiLog[];
};

export function LogsTable({ logs }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Time</TableHead>
          <TableHead>Level</TableHead>
          <TableHead>Method</TableHead>
          <TableHead>Endpoint</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Latency</TableHead>
          <TableHead>Message</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {logs.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="h-24 text-center">
              No logs found.
            </TableCell>
          </TableRow>
        ) : (
          logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell>{log.createdAt.toLocaleString()}</TableCell>

              <TableCell>
                <LevelBadge level={log.level} />
              </TableCell>

              <TableCell>
                <MethodBadge method={log.method} />
              </TableCell>

              <TableCell>{log.endpoint}</TableCell>

              <TableCell>
                <StatusBadge statusCode={log.statusCode} />
              </TableCell>

              <TableCell>{log.latency} ms</TableCell>

              <TableCell>{log.message}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
