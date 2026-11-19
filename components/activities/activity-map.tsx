"use client";

import { useEffect, useRef } from "react";
import type { Activity } from "@/types/activity";

interface ActivityMapProps {
  activities: Activity[];
}

export function ActivityMap({ activities }: ActivityMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;


    let map: import("leaflet").Map;

    import("leaflet").then((L) => {
      if (!containerRef.current) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      map = L.map(containerRef.current, { zoomControl: true }).setView([35.69, 139.75], 12);

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
        maxZoom: 19,
      }).addTo(map);

      const icon = L.divIcon({
        className: "",
        html: `<div style="width:14px;height:14px;background:#0a0a0a;border:2.5px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.5)"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
        popupAnchor: [0, -10],
      });

      const withCoords = activities.filter((a) => a.latitude && a.longitude);

      withCoords.forEach((a) => {
        const popup = L.popup({ closeButton: false, maxWidth: 180 }).setContent(
          `<div style="font-family:system-ui,sans-serif;padding:2px 0">
            <p style="font-size:11px;color:#6b7280;margin:0 0 2px 0">${a.location}</p>
            <p style="font-size:13px;font-weight:600;margin:0 0 6px 0;color:#0a0a0a">${a.name}</p>
            <a href="/activities/${a.slug}" style="font-size:12px;color:#0a0a0a;font-weight:500">Details →</a>
          </div>`
        );
        L.marker([a.latitude!, a.longitude!], { icon }).addTo(map).bindPopup(popup);
      });

      // Fit bounds if multiple markers
      if (withCoords.length > 1) {
        const bounds = L.latLngBounds(withCoords.map((a) => [a.latitude!, a.longitude!]));
        map.fitBounds(bounds, { padding: [40, 40] });
      } else if (withCoords.length === 1) {
        map.setView([withCoords[0].latitude!, withCoords[0].longitude!], 15);
      }
    });

    return () => {
      map?.remove();
    };
  }, [activities]);

  return (
    <div
      ref={containerRef}
      className="w-full rounded-2xl overflow-hidden border border-[var(--border)]"
      style={{ height: "calc(100vh - 120px)" }}
    />
  );
}
