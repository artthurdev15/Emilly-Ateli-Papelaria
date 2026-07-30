"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, Palette, MessageCircle, AlertCircle } from "lucide-react";
import { formatPrice, API_BASE_URL } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";
import { PaymentForm } from "@/components/checkout/PaymentForm";

const WHATSAPP_NUMBER = "5583991491382";

function buildMessage(
  orderNumber: string,
  items: { name: string; quantity: number; customName?: string; customNotes?: string }[],
  totalInCents: number,
  paymentMethod: string
): string {
  const labels: Record<string, string> = {
    pix: "Pix",
    credit: "Cartão de Crédito",
    boleto: "Boleto Bancário",
  };

  const lines = items.map((item) => {
    let line = `- ${item.quantity}x ${item.name}`;
    if (item.customName) line += ` (nome: ${item.customName})`;
    if (item.customNotes) line += `\n  Obs: ${item.customNotes}`;
    return line;
  });

  return [
    `Olá! Gostaria de finalizar meu pedido *${orderNumber}*:`,
    ...lines,
    "",
    `*Valor Total:* ${formatPrice(totalInCents)}`,
    `*Forma de Pagamento:* ${labels[paymentMethod] || paymentMethod}`,
  ].join("\n");
}

export default function CheckoutPage() {
  const { items, totalInCents, hasServiceItems, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState("pix");
  const [clientWhatsapp, setClientWhatsapp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    const cleanedWhats = clientWhatsapp.replace(/\D/g, "");
    if (!cleanedWhats || cleanedWhats.length < 10) {
      setError("Informe um número de WhatsApp válido com DDD");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.product.id,
            quantity: i.quantity,
            artworkUrl: i.artworkUrl,
            customizations: i.customizations,
          })),
          paymentMethod,
          clientWhatsapp: cleanedWhats,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Erro ao criar pedido");
      }

      const order = await res.json();

      const message = buildMessage(
        order.orderNumber,
        items.map((i) => ({
          name: i.product.name,
          quantity: i.quantity,
          customName: i.customizations?.nome,
          customNotes: i.customizations?.observacoes,
        })),
        totalInCents,
        paymentMethod
      );

      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

      clearCart();
      window.open(url, "_blank");
      router.push("/minha-conta/pedidos");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ShoppingBag size={64} className="text-rose-200 mx-auto mb-4" />
        <h1 className="text-xl font-bold text-gray-400 mb-2">Carrinho vazio</h1>
        <Link href="/produtos">
          <Button variant="primary">Ver Produtos</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/carrinho"
        className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-rose-400 mb-6 transition-colors"
      >
        <ArrowLeft size={14} /> Voltar ao Carrinho
      </Link>

      <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>

      {!user && (
        <div className="card p-4 flex items-center justify-between mb-6">
          <div>
            <p className="text-sm font-semibold text-gray-700">Já tem conta?</p>
            <p className="text-xs text-gray-400">Faça login para finalizar o pedido</p>
          </div>
          <Link href="/auth/login">
            <Button variant="primary" size="sm">Entrar</Button>
          </Link>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 rounded-xl text-sm text-red-400 mb-6">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <div className="card p-6 space-y-4">
            <h3 className="font-semibold text-gray-700">Contato</h3>
            <div>
              <label className="block text-sm text-gray-500 mb-1">
                Seu WhatsApp <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                placeholder="(83) 99999-9999"
                value={clientWhatsapp}
                onChange={(e) => setClientWhatsapp(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-rose-100 bg-paper text-sm focus:outline-none focus:border-rose-300 transition-all"
              />
              <p className="text-[10px] text-gray-300 mt-1">
                Usado para contato e confirmação do pedido
              </p>
            </div>
          </div>

          <PaymentForm value={paymentMethod} onChange={setPaymentMethod} />
        </div>

        <div className="lg:col-span-2">
          <div className="card p-6 space-y-4 sticky top-24">
            <h3 className="font-semibold text-gray-700">Resumo do Pedido</h3>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-rose-50 to-lilac-50 flex items-center justify-center shrink-0">
                    <span className="text-lg">🎨</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-gray-400">Qtd: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-700">
                    {formatPrice(item.product.priceInCents * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {hasServiceItems && (
              <div className="flex items-center gap-2 p-3 bg-lilac-50 rounded-xl text-xs text-lilac-600">
                <Palette size={14} />
                Seu pedido contém serviços gráficos
              </div>
            )}

            <hr className="border-rose-100" />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span className="text-gray-600">{formatPrice(totalInCents)}</span>
              </div>
              <hr className="border-rose-100" />
              <div className="flex justify-between font-bold text-gray-800 text-base">
                <span>Total</span>
                <span>{formatPrice(totalInCents)}</span>
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              size="lg"
              className="w-full"
              disabled={submitting || !user}
            >
              {submitting ? (
                "Criando pedido..."
              ) : (
                <>
                  <MessageCircle size={16} /> Finalizar Pedido via WhatsApp
                </>
              )}
            </Button>

            <p className="text-[10px] text-gray-300 text-center">
              O pedido será registrado e você será redirecionado ao WhatsApp.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
