"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Button } from "@/components/ui/button";

export function LogsFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateFilter(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());

    if (!value || value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    router.push(`${pathname}?${params.toString()}`);
  }

  function resetFilters() {
    router.push(pathname);
  }

  const selectedLevel = searchParams?.get("level") ?? "all";
  const selectedMethod = searchParams?.get("method") ?? "all";

  return (
    <div className="flex flex-wrap items-center gap-4">
      <Select defaultValue={selectedLevel} onValueChange={(value) => updateFilter("level", value)}>
        {" "}
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Log Level" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Levels</SelectItem>
          <SelectItem value="TRACE">TRACE</SelectItem>
          <SelectItem value="DEBUG">DEBUG</SelectItem>
          <SelectItem value="INFO">INFO</SelectItem>
          <SelectItem value="WARN">WARN</SelectItem>
          <SelectItem value="ERROR">ERROR</SelectItem>
          <SelectItem value="FATAL">FATAL</SelectItem>
        </SelectContent>
      </Select>

      <Select defaultValue={searchParams.get("method") ?? "all"} onValueChange={(value) => updateFilter("method", value)}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Method" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">All Methods</SelectItem>
          <SelectItem value="GET">GET</SelectItem>
          <SelectItem value="POST">POST</SelectItem>
          <SelectItem value="PUT">PUT</SelectItem>
          <SelectItem value="PATCH">PATCH</SelectItem>
          <SelectItem value="DELETE">DELETE</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline" onClick={resetFilters}>
        Reset
      </Button>
    </div>
  );
}
