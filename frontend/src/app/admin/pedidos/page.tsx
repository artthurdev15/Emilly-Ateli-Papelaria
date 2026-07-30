"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import Link from "next/link";
import {
  ShoppingCart,
  Search,
  Eye,
  KanbanSquare,
  XCircle,
  AlertCircle,
  FileDown,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatPrice, formatDateShort, API_BASE_URL } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types";

const STATUS_LABELS: Record<string, string> = {
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

export default function AdminPedidosPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const limit = 20;

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Faça login como administrador");
        setLoading(false);
        return;
      }

      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (statusFilter) params.set("status", statusFilter);
      if (search) params.set("search", search);

      console.log("[AdminPedidos] Fetching:", `/api/orders/admin?${params}`);

      const res = await fetch(`${API_BASE_URL}/orders/admin?${params}`, {
        cache: "no-store",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: `HTTP ${res.status}` }));
        throw new Error(err.message || `HTTP ${res.status}`);
      }

      const data = await res.json();
      console.log("[AdminPedidos] Response:", data);

      setOrders(data.data || []);
      setTotal(data.total || 0);
    } catch (err: any) {
      console.error("[AdminPedidos] Erro:", err);
      setError(err.message || "Erro ao carregar pedidos");
      setOrders([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search]);

  useEffect(() => { load(); }, [load]);

  const handleCancel = useCallback(async (id: string, orderNumber: string) => {
    if (!confirm(`Cancelar pedido ${orderNumber}?`)) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "CANCELLED", note: "Cancelado pelo administrador" }),
      });
      if (!res.ok) throw new Error("Erro ao cancelar");
      toast.success("Pedido cancelado");
      load();
    } catch (err: any) {
      toast.error(err.message);
    }
  }, [load]);

  const exportToCSV = () => {
    const rows = [["Pedido", "Cliente", "Produtos", "Total", "Status", "Data"]];
    orders.forEach((o) => {
      const products = o.items?.map((i) => `${i.quantity}x ${i.productName}`).join(", ") || "";
      const date = new Date(o.createdAt).toLocaleDateString("pt-BR");
      const total = (o.totalInCents / 100).toFixed(2).replace(".", ",");
      const status = STATUS_LABELS[o.status] || o.status;
      rows.push([o.orderNumber, o.user?.name || "", products, total, status, date]);
    });

    const SEP = ";";
    const csv = rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(SEP)).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pedidos-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Pedidos</h1>
          <p className="text-sm text-gray-400">{total} pedido(s)</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={exportToCSV} disabled={orders.length === 0}>
            <FileDown size={16} /> Exportar CSV
          </Button>
          <Link href="/admin/pedidos/kanban">
            <Button variant="secondary">
              <KanbanSquare size={16} /> Kanban
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
          <input
            placeholder="Buscar pedido ou cliente..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-rose-100 bg-paper text-sm focus:outline-none focus:border-rose-300 transition-all"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-3 py-2.5 rounded-xl border-2 border-rose-100 bg-paper text-sm focus:outline-none focus:border-rose-300"
        >
          <option value="">Todos os status</option>
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {error && !loading && (
        <div className="flex items-center gap-2 p-4 bg-red-50 rounded-xl text-sm text-red-400">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-400">Carregando...</div>
      ) : orders.length === 0 && !error ? (
        <div className="text-center py-16 card">
          <ShoppingCart size={48} className="text-rose-200 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">Nenhum pedido encontrado</p>
        </div>
      ) : orders.length > 0 ? (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-rose-100 bg-rose-50/50">
                  <th className="text-left px-4 py-3 font-semibold text-gray-500">Pedido</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500">Cliente</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500">Data</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500">Total</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-500">Status</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-500">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-50">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-rose-50/30 transition-colors">
                    <td className="px-4 py-3 font-semibold text-gray-700">
                      {order.orderNumber}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {order.user?.name || "---"}
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {formatDateShort(order.createdAt)}
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-700">
                      {formatPrice(order.totalInCents)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge status={order.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/pedidos/${order.id}`}
                          className="inline-flex items-center gap-1 text-xs text-serenity-500 hover:text-serenity-600"
                        >
                          <Eye size={14} /> Detalhes
                        </Link>
                        {order.status !== "CANCELLED" && order.status !== "REFUNDED" && order.status !== "DELIVERED" && (
                          <button
                            onClick={() => handleCancel(order.id, order.orderNumber)}
                            className="inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-500"
                          >
                            <XCircle size={14} /> Cancelar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
}
