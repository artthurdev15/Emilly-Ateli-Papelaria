"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Tags, ArrowRight } from "lucide-react";
import { api } from "@/lib/api";
import type { Category } from "@/types";

const emojis: Record<string, string> = {
  "papelaria-personalizada": "📒",
  "convites": "💌",
  "arte-digital": "🎨",
  "kits-festa": "🎉",
};

export default function CategoriasPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.categories
      .list()
      .then(setCategories)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Tags className="text-rose-400" /> Categorias
        </h1>
        <p className="text-sm text-gray-400 mt-1">Explore nossos produtos por categoria</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card animate-pulse p-6">
              <div className="w-12 h-12 bg-rose-100 rounded-xl mb-3" />
              <div className="h-4 bg-rose-100 rounded w-3/4 mb-2" />
              <div className="h-3 bg-rose-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/produtos?categoria=${cat.slug}`}
              className="card-hover p-6 group"
            >
              <span className="text-4xl block mb-3">{emojis[cat.slug] || "🎀"}</span>
              <h3 className="font-semibold text-gray-700 group-hover:text-rose-400 transition-colors">
                {cat.name}
              </h3>
              <p className="text-sm text-gray-400 mt-1">{cat._count?.products || 0} produtos</p>
              <span className="inline-flex items-center gap-1 text-xs text-rose-300 group-hover:text-rose-400 mt-3 transition-colors">
                Ver produtos <ArrowRight size={12} />
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
