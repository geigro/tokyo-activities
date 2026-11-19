"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Timer,
  ExternalLink,
  Globe,
} from "lucide-react";

import { Icon } from "@iconify/react";
import type { Activity } from "@/types/activity";
import { formatPriceRange, getGoogleMapsUrl, getAppleMapsUrl } from "@/lib/utils";
import { HOME, haversineKm } from "@/lib/location";
import { ActivityGallery } from "./activity-gallery";

interface ActivityDetailProps {
  activity: Activity;
}

export function ActivityDetail({ activity }: ActivityDetailProps) {
  const price = formatPriceRange(activity.priceMin, activity.priceMax, activity.priceCurrency);
  const mapsUrl = getGoogleMapsUrl(activity.address, activity.latitude, activity.longitude);
  const appleMapsUrl = getAppleMapsUrl(activity.address, activity.latitude, activity.longitude);
  const distance = activity.latitude && activity.longitude
    ? haversineKm(HOME.lat, HOME.lng, activity.latitude, activity.longitude)
    : null;

  return (
    <div id="detail-main" className="min-h-screen bg-[var(--background)]">
      {/* Gallery */}
      <div className="animate-fade-in px-4 pt-4 space-y-3">
        <Link
          href="/"
          onClick={() => sessionStorage.setItem("lastActivity", activity.slug)}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--muted)] text-[var(--foreground)] text-sm font-medium hover:opacity-70 transition-opacity"
        >
          <ArrowLeft className="w-4 h-4" />
          Zurück
        </Link>
        <div className="rounded-2xl overflow-hidden">
          <ActivityGallery images={activity.images} videos={activity.videos} name={activity.name} />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-fade-up">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] leading-tight">
            {activity.name}
          </h1>
          {activity.shortDescription && (
            <p className="text-base text-[var(--muted-foreground)] leading-relaxed">
              {activity.shortDescription}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <p className="text-sm sm:text-base text-[var(--foreground)] leading-relaxed">
            {activity.description}
          </p>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-1 gap-3">
          {activity.duration && (
            <InfoRow icon={<Timer className="w-4 h-4" />} label="Dauer" value={activity.duration} />
          )}
          <InfoRow icon={<MapPin className="w-4 h-4" />} label="Stadtteil" value={activity.location} />
          {activity.openingHours && (
            <InfoRow icon={<Clock className="w-4 h-4" />} label="Öffnungszeiten" value={activity.openingHours} />
          )}
          {distance != null && (
            <AirbnbRow distance={distance} />
          )}
        </div>

        {/* Price breakdown */}
        {activity.priceOptions && activity.priceOptions.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wide">
              Preise {activity.priceNote ? `(${activity.priceNote})` : ""}
            </h2>
            <div className="rounded-2xl overflow-hidden border border-[var(--border)]">
              {activity.priceOptions.map((opt, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between px-4 py-3 ${i < activity.priceOptions!.length - 1 ? "border-b border-[var(--border)]" : ""}`}
                >
                  <span className="text-sm text-[var(--foreground)]">{opt.label}</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-medium text-[var(--foreground)]">
                      {opt.price.toLocaleString("de-DE")} ¥
                    </span>
                    <span className="text-xs text-[var(--muted-foreground)]">
                      ≈ {(opt.price / 174.89).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Address */}
        <div className="p-4 rounded-2xl bg-[var(--muted)] space-y-3">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-[var(--muted-foreground)] mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-[var(--muted-foreground)] font-medium uppercase tracking-wide mb-0.5">
                Adresse
              </p>
              <p className="text-sm text-[var(--foreground)]">{activity.address}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 flex-1 justify-center py-2.5 px-4 rounded-xl bg-white text-gray-900 border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <Icon icon="logos:google-maps" width={18} height={18} style={{ display: "block" }} />
              Google Maps
            </a>
            <a
              href={appleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 flex-1 justify-center py-2.5 px-4 rounded-xl bg-white text-gray-900 border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <Icon icon="mdi:apple" width={18} height={18} style={{ display: "block" }} />
              Apple Maps
            </a>
          </div>
        </div>

        {/* Action buttons */}
        {activity.website && (
          <a
            href={activity.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl border border-[var(--border)] text-[var(--foreground)] text-sm font-medium hover:bg-[var(--muted)] transition-colors"
          >
            <SiteFavicon url={activity.website} />
            Offizielle Website
            <ExternalLink className="w-3 h-3 text-[var(--muted-foreground)]" />
          </a>
        )}

        {/* Tags */}
        {activity.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pb-8">
            {activity.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Bottom spacer for mobile bar */}
        <div className="h-20 sm:hidden" />
      </div>

      {/* Sticky bottom bar — mobile only */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-20">
        {/* Gradient */}
        <div className="pointer-events-none h-24 w-full"
          style={{ background: "linear-gradient(to top, var(--background) 0%, transparent 100%)" }}
        />
        <div className="bg-[var(--background)] px-4 py-3 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs text-[var(--muted-foreground)]">
            Preis{activity.priceNote ? ` (${activity.priceNote})` : ""}
          </p>
          <span className="text-base font-bold text-[var(--foreground)]">{price}</span>
          {activity.priceMin != null && activity.priceMin > 0 && (
            <p className="text-xs text-[var(--muted-foreground)]">
              ≈ {(activity.priceMin / 174.89).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{activity.priceMax && activity.priceMax !== activity.priceMin ? `–${(activity.priceMax / 174.89).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : ""} €
            </p>
          )}
        </div>
        {activity.website && (
          <a
            href={activity.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 py-2.5 px-5 rounded-xl bg-[var(--foreground)] text-[var(--background)] text-sm font-medium"
          >
            <SiteFavicon url={activity.website} />
            Website
          </a>
        )}
        </div>
      </div>
    </div>
  );
}

const AIRBNB_MAPS_URL_GOOGLE = `https://www.google.com/maps/search/?api=1&query=${HOME.lat},${HOME.lng}`;
const AIRBNB_MAPS_URL_APPLE = `https://maps.apple.com/?ll=${HOME.lat},${HOME.lng}&q=Airbnb`;
function osmTileUrl(lat: number, lng: number, zoom: number) {
  const x = Math.floor(((lng + 180) / 360) * Math.pow(2, zoom));
  const latRad = (lat * Math.PI) / 180;
  const y = Math.floor(((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * Math.pow(2, zoom));
  return { x, y, zoom };
}

function MapThumbnail({ lat, lng, zoom = 15, size = 64, width: w, height: h }: { lat: number; lng: number; zoom?: number; size?: number; width?: number; height?: number }) {
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { setMounted(true); }, []);
  const W = w ?? size;
  const H = h ?? size;
  if (!mounted) return <div style={{ width: W, height: H }} className="bg-[var(--muted)]" />;
  const { x, y } = osmTileUrl(lat, lng, zoom);
  const tiles = [-1, 0, 1].flatMap((dy) => [-1, 0, 1].map((dx) => ({ dx, dy, url: `https://tile.openstreetmap.org/${zoom}/${x + dx}/${y + dy}.png` })));
  const tileSize = 256;
  const fracX = ((lng + 180) / 360) * Math.pow(2, zoom) - x;
  const fracY = ((1 - Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) / 2) * Math.pow(2, zoom) - y;
  const scale = W / tileSize;
  const offsetX = -((fracX + 1) * tileSize - W / (2 * scale)) * scale;
  const offsetY = -((fracY + 1) * tileSize - H / (2 * scale)) * scale;

  return (
    <div className="relative overflow-hidden" style={{ width: W, height: H }}>
      <div className="absolute" style={{ left: offsetX, top: offsetY, width: tileSize * 3 * scale, height: tileSize * 3 * scale }}>
        {tiles.map(({ dx, dy, url }) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={`${dx},${dy}`} src={url} alt="" width={tileSize * scale} height={tileSize * scale}
            style={{ position: "absolute", left: (dx + 1) * tileSize * scale, top: (dy + 1) * tileSize * scale, display: "block" }}
          />
        ))}
      </div>
      {/* Pin */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-8 h-8 rounded-full bg-[#FF5A5F]/25 animate-ping" />
          <div className="w-4 h-4 rounded-full bg-[#FF5A5F] border-2 border-white shadow-lg z-10" />
        </div>
      </div>
    </div>
  );
}

function AirbnbRow({ distance }: { distance: number }) {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);

  const scrollY = useRef(0);
  useEffect(() => {
    const el = document.getElementById("detail-main");
    if (open) {
      scrollY.current = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY.current}px`;
      document.body.style.width = "100%";
      if (el) { el.style.transition = "opacity 0.22s ease"; el.style.opacity = "0.15"; }
    } else {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollY.current);
    }
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      const el2 = document.getElementById("detail-main");
      if (el2) el2.style.opacity = "1";
    };
  }, [open]);

  const main = () => document.getElementById("detail-main");

  function openModal() {
    setClosing(false);
    setOpen(true);
  }
  function closeModal() {
    setClosing(true);
    const el = main();
    if (el) el.style.opacity = "1";
    setTimeout(() => { setOpen(false); setClosing(false); }, 220);
  }
  return (
    <>
      <div className="flex items-center gap-3 py-3 border-b border-[var(--border)]">
        <span className="flex-shrink-0">
          <Icon icon="simple-icons:airbnb" width={16} height={16} style={{ display: "block", color: "#FF5A5F" }} />
        </span>
        <div className="flex-1 flex flex-col gap-1">
          <span className="text-xs text-[var(--muted-foreground)] font-medium uppercase tracking-wide">Vom Airbnb</span>
          <span className="text-sm text-[var(--foreground)]">{distance.toFixed(1)} km Luftlinie</span>
        </div>
        <button
          onClick={openModal}
          className="flex-shrink-0 rounded-xl overflow-hidden border border-[var(--border)] hover:opacity-80 transition-opacity"
          aria-label="Airbnb auf Karte anzeigen"
        >
          <MapThumbnail lat={HOME.lat} lng={HOME.lng} zoom={15} size={64} />
        </button>
      </div>

      {/* Popup — portal to body to escape transform stacking context */}
      {open && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          onClick={closeModal}
        >
          {/* no backdrop overlay */}
          <div
            className={`relative w-full max-w-sm rounded-2xl bg-[var(--background)] p-5 space-y-4 shadow-2xl ${closing ? "animate-popup-out" : "animate-popup-in"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <Icon icon="simple-icons:airbnb" width={20} height={20} style={{ color: "#FF5A5F" }} />
              <div>
                <p className="text-sm font-semibold text-[var(--foreground)]">Airbnb Standort</p>
                <p className="text-xs text-[var(--muted-foreground)]">雷門, Asakusa · Taitō, Tokyo</p>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden border border-[var(--border)]" style={{ height: 180 }}>
              <MapThumbnail lat={HOME.lat} lng={HOME.lng} zoom={16} width={400} height={180} />
            </div>
            <div className="flex gap-2">
              <a
                href={AIRBNB_MAPS_URL_GOOGLE}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 flex-1 justify-center py-2.5 px-4 rounded-xl bg-white text-gray-900 border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                <Icon icon="logos:google-maps" width={18} height={18} />
                Google Maps
              </a>
              <a
                href={AIRBNB_MAPS_URL_APPLE}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 flex-1 justify-center py-2.5 px-4 rounded-xl bg-white text-gray-900 border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                <Icon icon="mdi:apple" width={18} height={18} />
                Apple Maps
              </a>
            </div>
          </div>
        </div>
      , document.body)}
    </>
  );
}

function SiteFavicon({ url }: { url: string }) {
  const [failed, setFailed] = useState(false);
  const hostname = (() => { try { return new URL(url).hostname; } catch { return ""; } })();
  if (failed || !hostname) return <Globe className="w-4 h-4" />;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=32`}
      alt=""
      width={16}
      height={16}
      className="rounded-sm flex-shrink-0"
      onError={() => setFailed(true)}
    />
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-[var(--border)]">
      <span className="text-[var(--muted-foreground)] mt-0.5 flex-shrink-0">{icon}</span>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:w-full gap-0.5">
        <span className="text-xs text-[var(--muted-foreground)] font-medium uppercase tracking-wide sm:w-24 flex-shrink-0">
          {label}
        </span>
        <span className="text-sm text-[var(--foreground)] sm:text-right">{value}</span>
      </div>
    </div>
  );
}
