"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import type { Category } from "@/types";

const emojis: Record<string, string> = {
  "papelaria-personalizada": "📒",
  "convites": "💌",
  "arte-digital": "🎨",
  "kits-festa": "🎉",
};

export function CategoryCarousel() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    api.categories.list().then(setCategories).catch(() => {});
  }, []);

  if (categories.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/produtos?categoria=${cat.slug}`}
            className="card-hover p-6 text-center group"
          >
            <span className="text-3xl block mb-2">{emojis[cat.slug] || "🎀"}</span>
            <h3 className="font-semibold text-gray-700 group-hover:text-rose-400 transition-colors">
              {cat.name}
            </h3>
            <p className="text-xs text-gray-400 mt-1">{cat._count?.products || 0} produtos</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
