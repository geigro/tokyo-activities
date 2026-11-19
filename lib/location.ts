export const HOME = {
  lat: 35.710163,
  lng: 139.794193,
  label: "Airbnb",
};

export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function travelEstimate(km: number): { walk: string; metro: string } {
  const walkMin = Math.round((km / 5) * 60);
  const metroMin = Math.round((km / 30) * 60) + 10; // +10 min Wartezeit/Umsteigen

  const fmt = (min: number) => min < 60 ? `${min} Min.` : `${Math.floor(min / 60)}h ${min % 60}min`;

  return {
    walk: fmt(walkMin),
    metro: fmt(metroMin),
  };
}
