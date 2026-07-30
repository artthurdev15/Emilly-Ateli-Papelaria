"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Package, ArrowRight, Palette } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatPrice, formatDateShort } from "@/lib/utils";
import { api } from "@/lib/api";
import type { Order } from "@/types";

export default function MeusPedidosPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) router.push("/auth/login");
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      api.orders
        .my()
        .then((res) => setOrders(res.data))
        .catch(() => {})
        .finally(() => setLoadingOrders(false));
    }
  }, [user]);

  if (isLoading || !user)
    return <div className="max-w-4xl mx-auto px-4 py-20 text-center text-gray-400">Carregando...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Meus Pedidos</h1>

      {loadingOrders ? (
        <div className="text-center text-gray-400 py-10">Carregando pedidos...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16">
          <Package size={64} className="text-rose-200 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-400 mb-2">Nenhum pedido ainda</h2>
          <p className="text-sm text-gray-300 mb-6">Que tal fazer seu primeiro pedido?</p>
          <Link href="/produtos">
            <Button variant="primary">Ver Produtos</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/minha-conta/pedidos/${order.id}`}
              className="card-hover p-4 sm:p-6 block"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-bold text-gray-700">{order.orderNumber}</span>
                    <Badge status={order.status} />
                  </div>
                  <p className="text-sm text-gray-400">
                    {formatDateShort(order.createdAt)} &bull;{" "}
                    {order.items.length} item(ns)
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {order.items.slice(0, 3).map((item) => (
                      <span
                        key={item.id}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-rose-50 text-gray-500 text-xs rounded-lg"
                      >
                        {item.productName}
                      </span>
                    ))}
                    {order.items.length > 3 && (
                      <span className="text-xs text-gray-400">+{order.items.length - 3}</span>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-gray-800">{formatPrice(order.totalInCents)}</p>
                  <ArrowRight size={16} className="text-gray-300 ml-auto mt-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
