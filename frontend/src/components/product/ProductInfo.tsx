"use client";

import { useState } from "react";
import { ShoppingBag, Check, Minus, Plus, Palette, Type, MessageSquare } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/Button";
import { FileUpload } from "./FileUpload";
import type { Product } from "@/types";

export function ProductInfo({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [artworkUrl, setArtworkUrl] = useState("");
  const [added, setAdded] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customNotes, setCustomNotes] = useState("");
  const { addItem } = useCart();

  const customizations: Record<string, string> = {};
  if (customName.trim()) customizations.nome = customName.trim();
  if (customNotes.trim()) customizations.observacoes = customNotes.trim();

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product, 1, customizations);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const discount = product.comparePriceInCents
    ? Math.round((1 - product.priceInCents / product.comparePriceInCents) * 100)
    : 0;

  const inStock = product.stock > 0 || product.isService;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        {product.categories?.[0] && (
          <span className="inline-block px-3 py-1 bg-lilac-100 text-lilac-600 text-xs font-semibold rounded-full">
            {product.categories[0].category.name}
          </span>
        )}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{product.name}</h1>
        {product.shortDescription && (
          <p className="text-gray-400">{product.shortDescription}</p>
        )}
      </div>

      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-gray-800">
          {formatPrice(product.priceInCents)}
        </span>
        {product.comparePriceInCents && (
          <>
            <span className="text-lg text-gray-300 line-through">
              {formatPrice(product.comparePriceInCents)}
            </span>
            <span className="px-2 py-0.5 bg-mint-100 text-mint-600 text-xs font-bold rounded-full">
              -{discount}%
            </span>
          </>
        )}
      </div>

      {product.isService && (
        <div className="flex items-center gap-2 p-3 bg-lilac-50 rounded-xl">
          <Palette size={18} className="text-lilac-500" />
          <span className="text-sm text-lilac-700">
            Este é um <strong>serviço gráfico</strong>. Você receberá o arquivo digital.
          </span>
        </div>
      )}

      {product.description && (
        <div className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">
          {product.description}
        </div>
      )}

      {product.requiresAttachment && (
        <FileUpload
          instructions={product.attachmentInstructions}
          onUpload={setArtworkUrl}
          currentUrl={artworkUrl}
        />
      )}

      <div className="space-y-4 p-4 bg-rose-50/40 rounded-2xl border border-rose-100">
        <h4 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
          <Palette size={16} className="text-rose-400" /> Personalização
        </h4>
        <div>
          <label className="block text-xs text-gray-500 mb-1 flex items-center gap-1">
            <Type size={12} /> Nome para a capa / convite
          </label>
          <input
            type="text"
            placeholder="Ex: Maria & João"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border-2 border-rose-100 bg-paper text-sm focus:outline-none focus:border-rose-300 transition-all"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1 flex items-center gap-1">
            <MessageSquare size={12} /> Observações de personalização
          </label>
          <textarea
            placeholder="Ex: Tema ursinho safari, cores azul e laranja..."
            value={customNotes}
            onChange={(e) => setCustomNotes(e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 rounded-xl border-2 border-rose-100 bg-paper text-sm focus:outline-none focus:border-rose-300 transition-all resize-none"
          />
        </div>
      </div>

      {product.requiresAttachment && !artworkUrl && (
        <p className="text-xs text-amber-500 flex items-center gap-1">
          <Palette size={12} /> Envie a arte acima antes de adicionar ao carrinho
        </p>
      )}

      <div className="flex items-center gap-4">
        <div className="flex items-center border-2 border-rose-100 rounded-xl overflow-hidden">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="p-3 text-gray-400 hover:text-rose-400 hover:bg-rose-50 transition-colors"
          >
            <Minus size={16} />
          </button>
          <span className="w-12 text-center font-semibold text-gray-700">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="p-3 text-gray-400 hover:text-rose-400 hover:bg-rose-50 transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>

        {!inStock && !product.isService ? (
          <div className="text-sm text-red-400 font-medium">Fora de Estoque</div>
        ) : (
          <>
            {product.stock > 0 && !product.isService && (
              <span className="text-xs text-mint-500 flex items-center gap-1">
                <Check size={14} /> {product.stock} em estoque
              </span>
            )}
          </>
        )}
      </div>

      <Button
        onClick={handleAdd}
        size="lg"
        className="w-full"
        disabled={product.requiresAttachment && !artworkUrl}
      >
        {added ? (
          <><Check size={18} /> Adicionado!</>
        ) : (
          <><ShoppingBag size={18} /> Adicionar ao Carrinho</>
        )}
      </Button>
    </div>
  );
}
