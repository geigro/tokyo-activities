export type Activity = {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription?: string;
  category: string;
  tags: string[];
  images: string[];
  videos?: string[];
  priceMin?: number;
  priceMax?: number;
  priceCurrency: "JPY";
  priceNote?: string;
  priceOptions?: { label: string; price: number }[];
  location: string;
  address: string;
  latitude?: number;
  longitude?: number;
  website?: string;
  bookingUrl?: string;
  openingHours?: string;
  duration?: string;
  isIndoor?: boolean;
  isOutdoor?: boolean;
  createdAt: string;
};

export type SortOption = "alphabetical" | "price-asc" | "price-desc" | "newest";

export const CATEGORIES = [
  "All",
  "Attractions",
  "Entertainment",
  "Shopping",
  "Food",
  "Gaming",
  "Culture",
  "Nature",
  "Experiences",
  "Nightlife",
  "Viewpoints",
] as const;

export type Category = (typeof CATEGORIES)[number];
