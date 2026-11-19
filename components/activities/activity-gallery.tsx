"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

type Slide = { type: "image"; src: string } | { type: "video"; videoId: string };

interface ActivityGalleryProps {
  images: string[];
  videos?: string[];
  name: string;
}

function extractVideoId(url: string): string {
  if (url.includes("shorts/")) return url.split("shorts/")[1].split("?")[0];
  return url.split("v=")[1]?.split("&")[0] ?? url;
}

// YouTube returns a 120x90 "no thumbnail" image for unavailable videos
async function isYouTubeVideoAvailable(videoId: string): Promise<boolean> {
  try {
    const res = await fetch(`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`);
    if (!res.ok) return false;
    const blob = await res.blob();
    // Default "no video" thumbnail is exactly 120x90 = very small file (~1-2KB)
    return blob.size > 5000;
  } catch {
    return false;
  }
}

export function ActivityGallery({ images, videos, name }: ActivityGalleryProps) {
  const [current, setCurrent] = useState(0);
  const [validVideoIds, setValidVideoIds] = useState<string[] | null>(null);

  const rawVideoIds = (videos ?? []).map(extractVideoId).filter(Boolean);

  useEffect(() => {
    if (rawVideoIds.length === 0) {
      setValidVideoIds([]);
      return;
    }
    Promise.all(rawVideoIds.map(async (id) => ({ id, ok: await isYouTubeVideoAvailable(id) })))
      .then((results) => setValidVideoIds(results.filter((r) => r.ok).map((r) => r.id)));
  }, [videos?.join(",")]);

  const slides: Slide[] = [
    ...images.map((src): Slide => ({ type: "image", src })),
    ...(validVideoIds ?? []).map((videoId): Slide => ({ type: "video", videoId })),
  ];

  if (slides.length === 0) return null;

  return (
    <div className="relative w-full" style={{ aspectRatio: "16/9", maxHeight: "60vh" }}>
      <div
        className="w-full h-full flex overflow-x-auto snap-x snap-mandatory no-scrollbar"
        onScroll={(e) => {
          const el = e.currentTarget;
          const index = Math.round(el.scrollLeft / el.offsetWidth);
          setCurrent(index);
        }}
      >
        {slides.map((slide, i) => (
          <div key={i} className="relative flex-shrink-0 w-full h-full snap-center bg-black">
            {slide.type === "image" ? (
              <Image
                src={slide.src}
                alt={`${name} ${i + 1}`}
                fill
                className="object-cover"
                priority={i === 0}
                sizes="100vw"
              />
            ) : (
              <iframe
                src={`https://www.youtube.com/embed/${slide.videoId}?autoplay=0`}
                title={`${name} Video`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            )}
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center items-center gap-1.5">
          {slides.map((slide, i) => (
            slide.type === "video" ? (
              <div
                key={i}
                className={`flex items-center justify-center rounded-full transition-all duration-200 ${
                  i === current ? "w-5 h-5 bg-white" : "w-4 h-4 bg-white/50"
                }`}
              >
                <svg width="7" height="8" viewBox="0 0 7 8" fill="none">
                  <path d="M1 1l5 3-5 3V1z" fill={i === current ? "#000" : "#fff"} />
                </svg>
              </div>
            ) : (
              <div
                key={i}
                className={`rounded-full transition-all duration-200 ${
                  i === current ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50"
                }`}
              />
            )
          ))}
        </div>
      )}
    </div>
  );
}
