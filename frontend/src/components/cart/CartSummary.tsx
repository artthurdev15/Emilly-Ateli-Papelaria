"use client";

import Link from "next/link";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/Button";
import { CartItem } from "./CartItem";

export function CartSummary() {
  const { items, totalInCents, hasServiceItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <ShoppingBag size={64} className="text-rose-200 mb-4" />
        <h2 className="text-xl font-bold text-gray-400 mb-2">Seu carrinho está vazio</h2>
        <p className="text-sm text-gray-300 mb-6">Que tal dar uma olhada nos nossos produtos?</p>
        <Link href="/produtos">
          <Button variant="primary">Ver Produtos</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/produtos" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-rose-400 mb-6 transition-colors">
        <ArrowLeft size={14} /> Continuar Comprando
      </Link>

      <h1 className="text-2xl font-bold text-gray-800 mb-6">Carrinho</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {hasServiceItems && (
            <div className="p-3 bg-lilac-50 rounded-xl text-sm text-lilac-600 flex items-center gap-2">
              <span className="text-lg">💡</span>
              Seu carrinho contém serviços gráficos. Não esqueça de anexar as artes!
            </div>
          )}
          {items.map((item) => (
            <CartItem key={item.product.id} item={item} />
          ))}
        </div>

        <div className="card p-6 h-fit space-y-4 sticky top-24">
          <h3 className="font-semibold text-gray-700">Resumo</h3>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-400">
              <span>Subtotal</span>
              <span className="text-gray-600">{formatPrice(totalInCents)}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Frete</span>
              <span className="text-gray-300">Calcular no checkout</span>
            </div>
            <hr className="border-rose-100" />
            <div className="flex justify-between font-bold text-gray-800">
              <span>Total</span>
              <span>{formatPrice(totalInCents)}</span>
            </div>
          </div>

          <Link href="/checkout">
            <Button size="lg" className="w-full">
              Seguir para Checkout
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
