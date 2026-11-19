import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currency: "JPY" = "JPY"): string {
  if (currency === "JPY") {
    return `¥${amount.toLocaleString()}`;
  }
  return `${amount.toLocaleString()} ${currency}`;
}

export function formatPriceRange(min?: number, max?: number, currency: "JPY" = "JPY"): string {
  if (!min && min !== 0) return "Price varies";
  if (min === 0) return "Free";
  if (!max || max === min) return formatPrice(min, currency);
  return `${formatPrice(min, currency)} – ${formatPrice(max, currency)}`;
}

const JPY_TO_EUR = 1 / 174.89;

export function jpyToEur(jpy: number): string {
  return (jpy * JPY_TO_EUR).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function getGoogleMapsUrl(address: string, lat?: number, lng?: number): string {
  if (lat && lng) {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export function getAppleMapsUrl(address: string, lat?: number, lng?: number): string {
  if (lat && lng) {
    return `https://maps.apple.com/?ll=${lat},${lng}&q=${encodeURIComponent(address)}`;
  }
  return `https://maps.apple.com/?q=${encodeURIComponent(address)}`;
}
