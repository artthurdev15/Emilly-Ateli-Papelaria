"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Package,
  User,
  Truck,
  FileText,
  Palette,
  Download,
  XCircle,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { OrderStatusTimeline } from "@/components/order/OrderStatusTimeline";
import { formatPrice, formatDate, API_BASE_URL } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types";

interface Props {
  params: { id: string };
}

export default function AdminDetalhePedidoPage({ params }: Props) {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const load = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/orders/${params.id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      setOrder(data);
    } catch {
      router.push("/admin/pedidos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [params.id, router]);

  const handleStatusChange = async (status: OrderStatus) => {
    setUpdating(true);
    try {
      const token = localStorage.getItem("token");
      const note = prompt("Observação (opcional):");

      await fetch(`${API_BASE_URL}/orders/${params.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status, note: note || undefined }),
      });
      load();
    } catch {
      alert("Erro ao atualizar status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return <div className="text-center py-12 text-gray-400">Carregando...</div>;
  if (!order) return null;

  const statusTranslation: Record<string, string> = {
    PENDING_PAYMENT: "Aguardando Pagamento",
    AWAITING_ARTWORK: "Aguardando Arte",
    ARTWORK_UNDER_REVIEW: "Arte em Análise",
    ARTWORK_APPROVED: "Arte Aprovada",
    CONFIRMED: "Confirmado",
    IN_PRODUCTION: "Em Produção",
    SHIPPED: "Enviado",
    DELIVERED: "Entregue",
    CANCELLED: "Cancelado",
    REFUNDED: "Reembolsado",
  };

  const statusOptions: OrderStatus[] = [
    "PENDING_PAYMENT", "AWAITING_ARTWORK", "ARTWORK_UNDER_REVIEW",
    "ARTWORK_APPROVED", "CONFIRMED", "IN_PRODUCTION", "SHIPPED",
    "DELIVERED", "CANCELLED", "REFUNDED",
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-rose-400 transition-colors"
      >
        <ArrowLeft size={14} /> Voltar
      </button>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{order.orderNumber}</h1>
          <p className="text-sm text-gray-400 mt-1">
            {formatDate(order.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge status={order.status} className="text-sm px-4 py-2" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <Package size={16} className="text-rose-400" /> Itens do Pedido
            </h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-start gap-4 p-3 bg-rose-50/50 rounded-xl">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-50 to-lilac-50 flex items-center justify-center shrink-0">
                    <Package size={20} className="text-rose-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-700">{item.productName}</p>
                    <p className="text-xs text-gray-400">SKU: {item.productSku}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm text-gray-500">
                        {item.quantity}x {formatPrice(item.unitPriceInCents)}
                      </span>
                      <span className="font-semibold text-gray-700">
                        {formatPrice(item.totalInCents)}
                      </span>
                    </div>
                    {item.artworkUrl && (
                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        <a
                          href={item.artworkUrl}
                          target="_blank"
                          className="flex items-center gap-1 text-xs text-serenity-500 hover:text-serenity-600"
                        >
                          <Download size={12} /> Baixar Arte
                        </a>
                        {item.artworkApproved !== null && (
                          <Badge
                            status={
                              item.artworkApproved
                                ? "ARTWORK_APPROVED"
                                : "CANCELLED"
                            }
                          />
                        )}
                        {item.artworkNotes && (
                          <span className="text-[10px] text-gray-400 italic">
                            "{item.artworkNotes}"
                          </span>
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
              <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Truck size={16} className="text-serenity-400" /> Endereço de Entrega
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
        </div>

        <div className="space-y-6">
          <div className="card p-6 space-y-4">
            <h3 className="font-semibold text-gray-700">Ações</h3>
            <div className="space-y-2">
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
                disabled={updating}
                className="w-full px-3 py-2.5 rounded-xl border-2 border-rose-100 bg-paper text-sm focus:outline-none focus:border-rose-300"
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>
                    Mover para: {statusTranslation[s] || s}
                  </option>
                ))}
              </select>

              {order.status !== "CANCELLED" && order.status !== "REFUNDED" && order.status !== "DELIVERED" && (
                <button
                  onClick={() => handleStatusChange("CANCELLED")}
                  disabled={updating}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-400 bg-red-50 rounded-xl hover:bg-red-100 transition-all disabled:opacity-50"
                >
                  <XCircle size={16} /> Cancelar Pedido
                </button>
              )}
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span className="text-gray-600">
                  {formatPrice(order.totalInCents - order.shippingCostInCents)}
                </span>
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

            {order.paymentMethod && (
              <p className="text-xs text-gray-400">
                Pagamento: {order.paymentMethod}
                {(order as any).paymentId && ` (${(order as any).paymentId})`}
              </p>
            )}

            {order.user && (
              <div className="pt-2 border-t border-rose-100 space-y-2">
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <User size={12} /> {order.user.name} &bull; {order.user.email}
                </p>
                {order.clientWhatsapp && (
                  <a
                    href={`https://wa.me/55${order.clientWhatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-green-600 bg-green-50 rounded-xl hover:bg-green-100 transition-all"
                  >
                    <MessageCircle size={16} /> Chamar no WhatsApp
                  </a>
                )}
              </div>
            )}
          </div>

          <OrderStatusTimeline currentStatus={order.status} history={order.history} />
        </div>
      </div>
    </div>
  );
}
