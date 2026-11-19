import { notFound } from "next/navigation";
import { getActivityBySlug, getAllActivities } from "@/lib/activities";
import { ActivityDetail } from "@/components/activities/activity-detail";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const activities = getAllActivities();
  return activities.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const activity = getActivityBySlug(slug);
  if (!activity) return { title: "Not Found" };
  return {
    title: `${activity.name} · Tokyo Activities`,
    description: activity.shortDescription ?? activity.description.slice(0, 160),
  };
}

export default async function ActivityPage({ params }: PageProps) {
  const { slug } = await params;
  const activity = getActivityBySlug(slug);

  if (!activity) {
    notFound();
  }

  return <ActivityDetail activity={activity} />;
}
