"use client";

import React from "react";
import { StatCounts, FilterStatus } from "@/lib/types";
import { BookOpen, Clock, Flame, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsBarProps {
  stats: StatCounts;
  activeFilter: FilterStatus;
  onFilterChange: (status: FilterStatus) => void;
}

export function StatsBar({ stats, activeFilter, onFilterChange }: StatsBarProps) {
  const statItems = [
    {
      id: "all" as FilterStatus,
      label: "total shelf",
      count: stats.total,
      icon: BookOpen,
      color: "text-charcoal",
      accent: "bg-charcoal/5",
    },
    {
      id: "want_to_read" as FilterStatus,
      label: "want to read",
      count: stats.want_to_read,
      icon: Clock,
      color: "text-charcoal",
      accent: "bg-dew-drop",
    },
    {
      id: "reading" as FilterStatus,
      label: "currently reading",
      count: stats.reading,
      icon: Flame,
      color: "text-marker-orange",
      accent: "bg-[#ff6f1e]/10",
    },
    {
      id: "finished" as FilterStatus,
      label: "finished",
      count: stats.finished,
      icon: CheckCircle2,
      color: "text-sprout-sticker",
      accent: "bg-[#22c55e]/10",
    },
  ];

  return (
    <div className="w-full max-w-[1200px] mx-auto px-6 py-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {statItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeFilter === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onFilterChange(item.id)}
              className={cn(
                "group text-left px-4 py-3 rounded-[20px] border transition-all duration-200 cursor-pointer bg-cream-paper flex items-center justify-between",
                isActive
                  ? "border-charcoal ring-2 ring-charcoal/10 shadow-sm"
                  : "border-charcoal/20 hover:border-charcoal/50 hover:shadow-xs"
              )}
            >
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-wider font-sans font-medium text-charcoal/60">
                  {item.label}
                </span>
                <span className="font-serif-literary text-2xl sm:text-3xl font-bold text-cocoa-ink leading-tight mt-0.5">
                  {item.count}
                </span>
              </div>
              <div className={cn("w-9 h-9 rounded-full flex items-center justify-center transition-transform group-hover:scale-105", item.accent)}>
                <Icon className={cn("w-4 h-4", item.color)} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default StatsBar;
