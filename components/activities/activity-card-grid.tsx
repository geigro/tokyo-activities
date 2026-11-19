import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import type { Activity } from "@/types/activity";
import { formatPriceRange, jpyToEur } from "@/lib/utils";

interface ActivityCardGridProps {
  activities: Activity[];
}

export function ActivityCardGrid({ activities }: ActivityCardGridProps) {
  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-[var(--muted-foreground)] text-base">Keine Aktivitäten gefunden.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
      {activities.map((activity, i) => (
        <div key={activity.id} className="animate-fade-up" style={{ animationDelay: `${i * 45}ms` }}>
          <GridCard activity={activity} />
        </div>
      ))}
    </div>
  );
}

function GridCard({ activity }: { activity: Activity }) {
  const price = formatPriceRange(activity.priceMin, activity.priceMax, activity.priceCurrency);
  const eur = activity.priceMin != null && activity.priceMin > 0
    ? `≈ ${jpyToEur(activity.priceMin)} €`
    : null;
  const imageSrc = activity.images[0] ?? "";

  return (
    <Link
      href={`/activities/${activity.slug}`}
      className="group flex flex-col rounded-2xl overflow-hidden bg-[var(--card)] shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <div className="relative w-full" style={{ aspectRatio: "4/3" }}>
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={activity.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-[var(--muted)]" />
        )}
      </div>
      <div className="p-3 space-y-1">
        <p className="text-xs text-[var(--muted-foreground)] flex items-center gap-1">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          {activity.location}
        </p>
        <h2 className="font-semibold text-sm leading-snug text-[var(--foreground)] line-clamp-2">
          {activity.name}
        </h2>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-[var(--foreground)]">{price}</span>
          {eur && <span className="text-xs text-[var(--muted-foreground)]">{eur}</span>}
        </div>
      </div>
    </Link>
  );
}
