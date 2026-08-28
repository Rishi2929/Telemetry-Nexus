"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, RotateCcw, ShieldAlert, Globe } from "lucide-react";

export function LogsFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedLevel = searchParams?.get("level") ?? "all";
  const selectedMethod = searchParams?.get("method") ?? "all";

  const hasActiveFilters = selectedLevel !== "all" || selectedMethod !== "all";

  function updateFilter(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams ? searchParams.toString() : "");

    if (!value || value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  function resetFilters() {
    router.push(pathname);
  }

  return (
    <div className="rounded-lg border border-border/80 bg-card/95 p-3.5 shadow-md backdrop-blur-md font-sans text-left space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Log Level Select */}
          <FilterControl
            icon={ShieldAlert}
            value={selectedLevel}
            placeholder="Log Level"
            onValueChange={(val) => updateFilter("level", val)}
            options={[
              { label: "All Levels", value: "all" },
              { label: "TRACE", value: "TRACE" },
              { label: "DEBUG", value: "DEBUG" },
              { label: "INFO", value: "INFO" },
              { label: "WARN", value: "WARN" },
              { label: "ERROR", value: "ERROR" },
              { label: "FATAL", value: "FATAL" },
            ]}
          />

          {/* HTTP Method Select */}
          <FilterControl
            icon={Globe}
            value={selectedMethod}
            placeholder="HTTP Method"
            onValueChange={(val) => updateFilter("method", val)}
            options={[
              { label: "All Methods", value: "all" },
              { label: "GET", value: "GET" },
              { label: "POST", value: "POST" },
              { label: "PUT", value: "PUT" },
              { label: "PATCH", value: "PATCH" },
              { label: "DELETE", value: "DELETE" },
            ]}
          />
        </div>

        {/* Reset Action */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="h-9 font-mono text-xs text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80 gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5 text-zinc-400" />
            Reset Query
          </Button>
        )}
      </div>

      {/* Active Filter Indicators */}
      {hasActiveFilters && (
        <ActiveFiltersBar
          selectedLevel={selectedLevel}
          selectedMethod={selectedMethod}
          onRemoveLevel={() => updateFilter("level", "all")}
          onRemoveMethod={() => updateFilter("method", "all")}
        />
      )}
    </div>
  );
}

/* Sub-Components */

type FilterOption = {
  label: string;
  value: string;
};

type FilterControlProps = {
  icon: React.ElementType;
  value: string;
  placeholder: string;
  options: FilterOption[];
  onValueChange: (value: string | null) => void;
};

function FilterControl({ icon: Icon, value, placeholder, options, onValueChange }: FilterControlProps) {
  return (
    <div className="flex items-center gap-2">
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-44 h-9 font-mono text-xs bg-zinc-900/80 border-border/70 focus:ring-emerald-500/30 text-zinc-200">
          <div className="flex items-center gap-2 truncate">
            <Icon className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <SelectValue placeholder={placeholder} />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-zinc-950 border-border/80 font-mono text-xs text-zinc-200">
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value} className="focus:bg-zinc-800 focus:text-zinc-100">
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

type ActiveFiltersBarProps = {
  selectedLevel: string;
  selectedMethod: string;
  onRemoveLevel: () => void;
  onRemoveMethod: () => void;
};

function ActiveFiltersBar({ selectedLevel, selectedMethod, onRemoveLevel, onRemoveMethod }: ActiveFiltersBarProps) {
  return (
    <div className="flex items-center gap-2 pt-2 border-t border-border/40 font-mono text-[11px] text-zinc-400">
      <div className="flex items-center gap-1.5">
        <Filter className="h-3 w-3 text-emerald-400" />
        <span>Active Filters:</span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {selectedLevel !== "all" && (
          <Badge
            variant="outline"
            onClick={onRemoveLevel}
            className="cursor-pointer gap-1 border-amber-500/40 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 text-[10px] py-0 px-2 h-5"
          >
            LEVEL: {selectedLevel}
            <span className="text-zinc-400 hover:text-zinc-100">×</span>
          </Badge>
        )}

        {selectedMethod !== "all" && (
          <Badge
            variant="outline"
            onClick={onRemoveMethod}
            className="cursor-pointer gap-1 border-sky-500/40 bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 text-[10px] py-0 px-2 h-5"
          >
            METHOD: {selectedMethod}
            <span className="text-zinc-400 hover:text-zinc-100">×</span>
          </Badge>
        )}
      </div>
    </div>
  );
}
