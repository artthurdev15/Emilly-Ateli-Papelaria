"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Package, Truck, FileText, Palette } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { OrderStatusTimeline } from "@/components/order/OrderStatusTimeline";
import { formatPrice, formatDate } from "@/lib/utils";
import { api } from "@/lib/api";
import type { Order } from "@/types";

interface Props {
  params: { id: string };
}

export default function DetalhePedidoPage({ params }: Props) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) router.push("/auth/login");
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      api.orders
        .get(params.id)
        .then(setOrder)
        .catch(() => router.push("/minha-conta/pedidos"))
        .finally(() => setLoading(false));
    }
  }, [user, params.id, router]);

  if (isLoading || !user)
    return <div className="max-w-4xl mx-auto px-4 py-20 text-center text-gray-400">Carregando...</div>;

  if (loading)
    return <div className="max-w-4xl mx-auto px-4 py-20 text-center text-gray-400">Carregando pedido...</div>;

  if (!order) return null;

  const serviceItems = order.items.filter((i) => i.artworkUrl);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/minha-conta/pedidos"
        className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-rose-400 mb-6 transition-colors"
      >
        <ArrowLeft size={14} /> Voltar aos Pedidos
      </Link>

      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{order.orderNumber}</h1>
          <p className="text-sm text-gray-400 mt-1">
            Pedido realizado em {formatDate(order.createdAt)}
          </p>
        </div>
        <Badge status={order.status} className="text-sm px-4 py-2" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <div className="card p-6">
            <h3 className="font-semibold text-gray-700 mb-4">Itens do Pedido</h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-start gap-4 pb-4 border-b border-rose-50 last:border-0">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-rose-50 to-lilac-50 flex items-center justify-center shrink-0">
                    {item.artworkUrl ? (
                      <Palette size={24} className="text-lilac-400" />
                    ) : (
                      <Package size={24} className="text-rose-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-700">{item.productName}</p>
                    <p className="text-xs text-gray-400">SKU: {item.productSku}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm text-gray-500">
                        Qtd: {item.quantity} x {formatPrice(item.unitPriceInCents)}
                      </span>
                      <span className="font-semibold text-gray-700">
                        {formatPrice(item.totalInCents)}
                      </span>
                    </div>
                    {item.artworkUrl && (
                      <div className="flex items-center gap-2 mt-2">
                        <a
                          href={item.artworkUrl}
                          target="_blank"
                          className="flex items-center gap-1 text-xs text-serenity-500 hover:text-serenity-600"
                        >
                          <FileText size={12} /> Ver arte enviada
                        </a>
                        {item.artworkApproved === true && (
                          <span className="text-[10px] text-mint-500 font-medium">Aprovada</span>
                        )}
                        {item.artworkApproved === false && (
                          <span className="text-[10px] text-red-400 font-medium">Rejeitada</span>
                        )}
                        {item.artworkNotes && (
                          <p className="text-[10px] text-gray-400 italic w-full mt-0.5">
                            Obs: {item.artworkNotes}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {order.address && (
            <div className="card p-6">
              <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Truck size={16} className="text-serenity-400" />
                Endereço de Entrega
              </h3>
              <p className="text-sm text-gray-500">
                {order.address.street}, {order.address.number}
                {order.address.complement && ` - ${order.address.complement}`}
                <br />
                {order.address.district} - {order.address.city}/{order.address.state}
                <br />
                CEP: {order.address.zipCode}
              </p>
            </div>
          )}

          {(order.trackingCode || order.estimatedDays) && (
            <div className="card p-6">
              <h3 className="font-semibold text-gray-700 mb-2">Rastreio</h3>
              {order.trackingCode && (
                <p className="text-sm text-gray-500">
                  Código:{" "}
                  {order.trackingUrl ? (
                    <a
                      href={order.trackingUrl}
                      target="_blank"
                      className="text-serenity-500 hover:underline"
                    >
                      {order.trackingCode}
                    </a>
                  ) : (
                    order.trackingCode
                  )}
                </p>
              )}
              {order.estimatedDays && (
                <p className="text-sm text-gray-500">
                  Prazo estimado: <strong>{order.estimatedDays} dias úteis</strong>
                </p>
              )}
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <OrderStatusTimeline currentStatus={order.status} history={order.history} />

          <div className="card p-6 space-y-3">
            <h3 className="font-semibold text-gray-700">Resumo</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span className="text-gray-600">{formatPrice(order.totalInCents - order.shippingCostInCents)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Frete</span>
                <span className="text-gray-600">{formatPrice(order.shippingCostInCents)}</span>
              </div>
              {order.discountInCents > 0 && (
                <div className="flex justify-between text-mint-500">
                  <span>Desconto</span>
                  <span>-{formatPrice(order.discountInCents)}</span>
                </div>
              )}
              <hr className="border-rose-100" />
              <div className="flex justify-between font-bold text-gray-800">
                <span>Total</span>
                <span>{formatPrice(order.totalInCents)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
