"use client";

import React from "react";
import { FilterStatus } from "@/lib/types";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilter: FilterStatus;
  onFilterChange: (status: FilterStatus) => void;
}

export function Toolbar({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
}: ToolbarProps) {
  const filterTabs: { id: FilterStatus; label: string }[] = [
    { id: "all", label: "all books" },
    { id: "want_to_read", label: "want to read" },
    { id: "reading", label: "reading" },
    { id: "finished", label: "finished" },
  ];

  return (
    <div className="w-full max-w-[1200px] mx-auto px-6 py-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
      {/* Search Bar */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/45 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="search title or author..."
          className="w-full pl-10 pr-10 py-2 rounded-[20px] border border-charcoal/20 bg-cream-paper text-charcoal placeholder:text-charcoal/40 text-sm focus:outline-none focus:border-charcoal focus:ring-2 focus:ring-charcoal/10 transition-all shadow-2xs"
          id="search-input"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center text-charcoal/50 hover:text-charcoal hover:bg-black/5"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
        <div className="hidden sm:flex items-center mr-1 text-xs text-charcoal/50">
          <SlidersHorizontal className="w-3.5 h-3.5 mr-1" />
          filter:
        </div>
        {filterTabs.map((tab) => {
          const isActive = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onFilterChange(tab.id)}
              className={cn(
                "whitespace-nowrap px-3.5 py-1.5 rounded-[20px] text-xs sm:text-sm font-medium transition-all duration-150 cursor-pointer",
                isActive
                  ? "bg-charcoal text-cream-paper shadow-xs"
                  : "bg-cream-paper border border-charcoal/15 text-charcoal/70 hover:border-charcoal/40 hover:text-charcoal"
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default Toolbar;
