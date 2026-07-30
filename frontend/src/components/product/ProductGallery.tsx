"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProductImage } from "@/types";

export function ProductGallery({ images }: { images: ProductImage[] }) {
  const [selected, setSelected] = useState(0);
  const sorted = images.sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-4">
      <div className="relative aspect-square bg-gradient-to-br from-rose-50 via-lilac-50 to-serenity-50 rounded-3xl">
        {sorted[selected] ? (
          <Image
            src={sorted[selected].url}
            alt={sorted[selected].alt || ""}
            fill
            className="object-contain p-12"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-8xl">🎨</span>
          </div>
        )}
      </div>
      {sorted.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {sorted.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setSelected(i)}
              className={`shrink-0 w-20 h-20 rounded-xl border-2 overflow-hidden transition-all ${
                i === selected
                  ? "border-rose-300 ring-2 ring-rose-100"
                  : "border-rose-100 hover:border-rose-200"
              }`}
            >
              <div className="relative w-full h-full">
                <Image src={img.url} alt={img.alt || ""} fill className="object-cover" sizes="80px" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
