"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { CATEGORIES, type Category, type SortOption } from "@/types/activity";
import { cn } from "@/lib/utils";

interface ActivityFiltersProps {
  query: string;
  onQueryChange: (q: string) => void;
  category: Category;
  onCategoryChange: (c: Category) => void;
  sort: SortOption;
  onSortChange: (s: SortOption) => void;
  totalCount: number;
  filteredCount: number;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Neueste" },
  { value: "alphabetical", label: "A–Z" },
  { value: "price-asc", label: "Preis ↑" },
  { value: "price-desc", label: "Preis ↓" },
];

export function ActivityFilters({
  query,
  onQueryChange,
  category,
  onCategoryChange,
  sort,
  onSortChange,
  totalCount,
  filteredCount,
}: ActivityFiltersProps) {
  return (
    <div className="space-y-3">
      {/* Search + Sort row */}
      <div className="flex gap-2">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)] pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Aktivitäten suchen..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[var(--muted)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] text-sm outline-none focus:ring-2 focus:ring-[var(--border)] transition-all"
          />
        </div>

        {/* Sort */}
        <div className="relative">
          <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)] pointer-events-none" />
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="pl-9 pr-3 py-2.5 rounded-xl bg-[var(--muted)] text-[var(--foreground)] text-sm outline-none focus:ring-2 focus:ring-[var(--border)] appearance-none cursor-pointer transition-all"
            aria-label="Aktivitäten sortieren"
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat as Category)}
            className={cn(
              "flex-shrink-0 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all",
              category === cat
                ? "bg-[var(--foreground)] text-[var(--background)]"
                : "bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results count */}
      {(query || category !== "All") && (
        <p className="text-xs text-[var(--muted-foreground)]">
          {filteredCount} von {totalCount} Aktivitäten
        </p>
      )}
    </div>
  );
}
