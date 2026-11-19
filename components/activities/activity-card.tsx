"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import type { Activity } from "@/types/activity";
import { formatPriceRange, jpyToEur } from "@/lib/utils";

interface ActivityCardProps {
  activity: Activity;
}

export function ActivityCard({ activity }: ActivityCardProps) {
  const price = formatPriceRange(activity.priceMin, activity.priceMax, activity.priceCurrency);
  const eurPrice = activity.priceMin != null && activity.priceMin > 0
    ? `≈ ${jpyToEur(activity.priceMin)} €${activity.priceMax && activity.priceMax !== activity.priceMin ? `–${jpyToEur(activity.priceMax)} €` : ""}`
    : null;
  const imageSrc = activity.images[0] ?? "";

  return (
    <Link
      href={`/activities/${activity.slug}`}
      className="group flex items-center gap-4 rounded-2xl overflow-hidden bg-[var(--card)] shadow-sm hover:shadow-md transition-shadow duration-200 p-3"
    >
      {/* Image */}
      <div className="relative flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={activity.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="112px"
          />
        ) : (
          <div className="w-full h-full bg-[var(--muted)] flex items-center justify-center">
            <span className="text-[var(--muted-foreground)] text-xs">No image</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1">
        <span className="text-xs text-[var(--muted-foreground)] flex items-center gap-1">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          {activity.location}
        </span>

        <h2 className="font-semibold text-sm sm:text-base leading-snug text-[var(--foreground)] truncate">
          {activity.name}
        </h2>

        {activity.shortDescription && (
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)] line-clamp-2 leading-relaxed">
            {activity.shortDescription}
          </p>
        )}

        <div className="flex flex-col">
          <span className="text-sm font-medium text-[var(--foreground)]">
            {price}{activity.priceNote ? ` (${activity.priceNote})` : ""}
          </span>
          {eurPrice && (
            <span className="text-xs text-[var(--muted-foreground)]">{eurPrice}</span>
          )}
        </div>

</div>
    </Link>
  );
}
