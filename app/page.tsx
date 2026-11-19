import { MapPin } from "lucide-react";
import { getAllActivities } from "@/lib/activities";
import { ActivityGrid } from "@/components/activities/activity-grid";

const allActivities = getAllActivities();

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="fixed top-0 left-0 right-0 z-10 bg-[var(--background)] border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-4 py-4 sm:py-5 flex items-center gap-2">
          <h1 className="text-lg sm:text-xl font-bold text-[var(--foreground)]">Tokyo Activities</h1>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)]">
            {allActivities.length}
          </span>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)] ml-1 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            Aktivitäten in Tokio
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pt-24 pb-12">
        <ActivityGrid activities={allActivities} />
      </main>
    </div>
  );
}
