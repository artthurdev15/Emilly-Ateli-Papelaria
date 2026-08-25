"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { api } from "@/lib/api";
import { formatPrice, resolveImageUrl } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/Button";
import type { Product } from "@/types";

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const { addItem } = useCart();

  useEffect(() => {
    api.products.list({ featured: "true", limit: "8" }).then((res) => {
      setProducts(res.data);
    }).catch(() => {});
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Produtos em Destaque
          </h2>
          <p className="text-gray-400 mt-1">Os queridinhos da Emilly</p>
        </div>
        <Link href="/produtos" className="hidden sm:flex items-center gap-1 text-sm text-rose-400 hover:text-rose-500 transition-colors">
          Ver Todos <ArrowRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product) => (
          <div key={product.id} className="card-hover group">
            <Link href={`/produtos/${product.slug}`}>
              <div className="relative h-48 md:h-64 bg-gradient-to-br from-rose-50 to-lilac-50 rounded-t-2xl overflow-hidden">
                {product.images?.[0] ? (
                  <Image
                    src={resolveImageUrl(product.images[0].url)}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-5xl">🎨</span>
                  </div>
                )}
              </div>
            </Link>
            <div className="p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <Link href={`/produtos/${product.slug}`}>
                    <h3 className="font-semibold text-gray-700 text-sm truncate group-hover:text-rose-400 transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  {product.shortDescription && (
                    <p className="text-xs text-gray-400 truncate mt-0.5">
                      {product.shortDescription}
                    </p>
                  )}
                </div>
                {product.isService && (
                  <span className="shrink-0 px-2 py-0.5 bg-lilac-100 text-lilac-600 text-[10px] font-semibold rounded-full">
                    Serviço
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div>
                  {product.comparePriceInCents && (
                    <span className="text-xs text-gray-300 line-through mr-1">
                      {formatPrice(product.comparePriceInCents)}
                    </span>
                  )}
                  <span className="font-bold text-gray-800">
                    {formatPrice(product.priceInCents)}
                  </span>
                </div>
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

      <div className="mt-8 text-center sm:hidden">
        <Link href="/produtos">
          <Button variant="outline" size="md">
            Ver Todos os Produtos <ArrowRight size={16} />
          </Button>
        </Link>
      </div>
    </section>
  );
}
