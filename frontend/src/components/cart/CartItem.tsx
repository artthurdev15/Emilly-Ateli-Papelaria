"use client";

import Image from "next/image";
import { Minus, Plus, Trash2, Palette } from "lucide-react";
import { formatPrice, resolveImageUrl } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import type { CartItem as CartItemType } from "@/types";

export function CartItem({ item }: { item: CartItemType }) {
  const { updateQuantity, removeItem } = useCart();
  const { product } = item;

  return (
    <div className="flex items-center gap-4 p-4 card">
      <div className="relative w-20 h-20 rounded-xl bg-gradient-to-br from-rose-50 to-lilac-50 shrink-0 overflow-hidden">
        {product.images?.[0] ? (
          <Image src={resolveImageUrl(product.images[0].url)} alt="" fill className="object-contain p-2" sizes="80px" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-2xl">🎨</span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-gray-700 text-sm truncate">{product.name}</h3>
            <p className="text-xs text-gray-400">{product.sku}</p>
          </div>
          <span className="font-bold text-gray-800 text-sm shrink-0">
            {formatPrice(product.priceInCents * item.quantity)}
          </span>
        </div>

        {product.isService && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-lilac-100 text-lilac-600 text-[10px] font-semibold rounded-full mt-1">
            <Palette size={10} /> Serviço Gráfico
          </span>
        )}

        {item.artworkUrl && (
          <div className="flex items-center gap-1 text-[10px] text-mint-500 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-mint-400" /> Arte anexada
          </div>
        )}
        {item.customizations?.nome && (
          <p className="text-[10px] text-gray-400 mt-1">Nome: {item.customizations.nome}</p>
        )}
        {item.customizations?.observacoes && (
          <p className="text-[10px] text-gray-400 italic truncate">Obs: {item.customizations.observacoes}</p>
        )}

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center border border-rose-100 rounded-lg overflow-hidden">
            <button
              onClick={() => updateQuantity(product.id, item.quantity - 1)}
              className="p-1.5 text-gray-400 hover:text-rose-400 hover:bg-rose-50"
            >
              <Minus size={12} />
            </button>
            <span className="w-8 text-center text-xs font-semibold text-gray-700">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(product.id, item.quantity + 1)}
              className="p-1.5 text-gray-400 hover:text-rose-400 hover:bg-rose-50"
            >
              <Plus size={12} />
            </button>
          </div>
          <button
            onClick={() => removeItem(product.id)}
            className="p-1.5 text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
