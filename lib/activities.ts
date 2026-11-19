import { activities } from "@/data/activities";
import type { Activity, SortOption } from "@/types/activity";

export function getAllActivities(): Activity[] {
  return activities;
}

export function getActivityBySlug(slug: string): Activity | undefined {
  return activities.find((a) => a.slug === slug);
}

export function filterActivities(
  items: Activity[],
  {
    query,
    category,
    sort,
  }: {
    query?: string;
    category?: string;
    sort?: SortOption;
  }
): Activity[] {
  let result = [...items];

  if (query && query.trim()) {
    const q = query.toLowerCase().trim();
    result = result.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        (a.shortDescription?.toLowerCase().includes(q) ?? false) ||
        a.category.toLowerCase().includes(q) ||
        a.location.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  if (category && category !== "All") {
    result = result.filter((a) => a.category === category);
  }

  switch (sort) {
    case "alphabetical":
      result.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "price-asc":
      result.sort((a, b) => (a.priceMin ?? 0) - (b.priceMin ?? 0));
      break;
    case "price-desc":
      result.sort((a, b) => (b.priceMin ?? 0) - (a.priceMin ?? 0));
      break;
    case "newest":
      result.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;
    default:
      break;
  }

  return result;
}
