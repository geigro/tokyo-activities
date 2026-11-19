"use client";

import { useEffect, useRef } from "react";
import type { Activity } from "@/types/activity";
import { ActivityCard } from "./activity-card";

interface ActivityGridProps {
  activities: Activity[];
}

export function ActivityGrid({ activities }: ActivityGridProps) {
  const refs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const slug = sessionStorage.getItem("lastActivity");
    if (!slug) return;
    sessionStorage.removeItem("lastActivity");
    const el = refs.current[slug];
    if (!el) return;
    // Wait for paint, then scroll + highlight
    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => el.classList.add("highlight-card"), 400);
    });
  }, []);

  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-[var(--muted-foreground)] text-base">Keine Aktivitäten gefunden.</p>
        <p className="text-[var(--muted-foreground)] text-sm mt-1">
          Passe deine Suche oder Filter an.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      {activities.map((activity, i) => (
        <div
          key={activity.id}
          ref={(el) => { refs.current[activity.slug] = el; }}
          className="animate-fade-up rounded-2xl"
          style={{ animationDelay: `${i * 45}ms` }}
        >
          <ActivityCard activity={activity} />
        </div>
      ))}
    </div>
  );
}
