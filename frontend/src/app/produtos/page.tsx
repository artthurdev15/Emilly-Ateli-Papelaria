"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Search, ShoppingBag, SlidersHorizontal, Palette, X } from "lucide-react";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/Button";
import type { Product } from "@/types";

export default function ProdutosPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const { addItem } = useCart();
  const limit = 12;

  const category = searchParams.get("categoria");
  const isService = searchParams.get("isService");

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string> = {
      page: String(page),
      limit: String(limit),
    };
    if (search) params.search = search;
    if (category) params.category = category;
    if (isService) params.isService = isService;

    api.products.list(params)
      .then((res) => { setProducts(res.data); setTotal(res.total); })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [page, search, category, isService]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {category ? category.replace("-", " ") : "Produtos"}
          </h1>
          <p className="text-sm text-gray-400">{total} produto(s)</p>
        </div>
      </div>

      <div className="relative mb-6">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
        <input
          placeholder="Buscar produtos..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-rose-100 bg-paper text-sm focus:outline-none focus:border-rose-300 transition-all"
        />
      </div>

      {isService && (
        <div className="flex items-center gap-2 p-3 bg-lilac-50 rounded-xl text-sm text-lilac-600 mb-6">
          <Palette size={18} />
          Mostrando apenas serviços gráficos
          <Link href="/produtos" className="ml-auto text-lilac-400 hover:text-lilac-500">
            <X size={16} />
          </Link>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card animate-pulse p-4">
              <div className="aspect-square bg-rose-100 rounded-xl mb-3" />
              <div className="h-4 bg-rose-100 rounded w-3/4 mb-2" />
              <div className="h-4 bg-rose-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 font-medium">Nenhum produto encontrado</p>
          <Link href="/produtos" className="text-sm text-rose-400 hover:text-rose-500 mt-2 inline-block">
            Limpar filtros
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <div key={product.id} className="card-hover group">
                <Link href={`/produtos/${product.slug}`}>
      <div className="relative h-48 md:h-64 bg-gradient-to-br from-rose-50 to-lilac-50 rounded-t-2xl overflow-hidden">
            {product.images?.[0] ? (
            <Image src={product.images[0].url} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-4xl">🎨</span>
            </div>
          )}
        </div>
      </Link>
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link href={`/produtos/${product.slug}`}>
              <h3 className="font-semibold text-gray-700 text-sm truncate group-hover:text-rose-400 transition-colors">
                {product.name}
              </h3>
            </Link>
            {product.shortDescription && (
              <p className="text-xs text-gray-400 truncate mt-0.5">{product.shortDescription}</p>
            )}
          </div>
          {product.isService && (
            <span className="shrink-0 px-2 py-0.5 bg-lilac-100 text-lilac-600 text-[10px] font-semibold rounded-full">
              Serviço
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="font-bold text-gray-800">{formatPrice(product.priceInCents)}</span>
          <button
            onClick={() => addItem(product)}
            className="w-full sm:w-auto py-3 sm:py-2 px-4 sm:px-3 bg-rose-50 text-rose-400 rounded-xl hover:bg-rose-100 hover:text-rose-500 transition-all text-sm font-semibold flex items-center justify-center gap-2"
          >
            <ShoppingBag size={16} />
            <span className="sm:hidden">Adicionar</span>
          </button>
        </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                    p === page ? "bg-rose-100 text-rose-500" : "text-gray-400 hover:bg-gray-100"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
