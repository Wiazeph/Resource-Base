"use client";

import { ChevronLeft, ChevronRight, ChevronsLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

/** First / prev / "page X of Y" / next pager — shared by browse + grids. */
export function Pagination({
  page,
  totalPages,
  onChange,
  prevLabel,
  nextLabel,
  pageLabel,
  firstLabel,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  prevLabel: string;
  nextLabel: string;
  pageLabel: string;
  firstLabel: string;
}) {
  return (
    <div className="mt-6 flex items-center justify-center gap-2">
      <Button
        variant="outline"
        size="sm"
        disabled={page <= 1}
        onClick={() => onChange(1)}
        aria-label={firstLabel}
        title={firstLabel}
      >
        <ChevronsLeft className="size-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        <ChevronLeft className="size-4" />
        {prevLabel}
      </Button>
      <span className="px-3 text-sm text-muted-foreground tabular-nums">
        {pageLabel}
      </span>
      <Button
        variant="outline"
        size="sm"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
      >
        {nextLabel}
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
}
