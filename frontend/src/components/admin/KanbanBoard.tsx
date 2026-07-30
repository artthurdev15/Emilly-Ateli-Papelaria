"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import {
  KanbanSquare,
  ChevronDown,
  ChevronUp,
  Download,
  CheckCircle,
  XCircle,
  Ban,
  GripVertical,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatPrice, formatDateShort, cn, API_BASE_URL } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types";

const columns: { status: OrderStatus; label: string; color: string }[] = [
  { status: "PENDING_PAYMENT", label: "Novos Pedidos", color: "border-t-rose-400" },
  { status: "AWAITING_ARTWORK", label: "Aguardando Arte", color: "border-t-yellow-400" },
  { status: "ARTWORK_UNDER_REVIEW", label: "Arte em Análise", color: "border-t-lilac-400" },
  { status: "ARTWORK_APPROVED", label: "Arte Aprovada", color: "border-t-serenity-400" },
  { status: "CONFIRMED", label: "Confirmado", color: "border-t-mint-400" },
  { status: "IN_PRODUCTION", label: "Em Produção", color: "border-t-rose-400" },
];

function OrderCard({
  order,
  onStatusChange,
  onApproveArtwork,
  onCancel,
}: {
  order: Order;
  onStatusChange: (id: string, status: OrderStatus) => void;
  onApproveArtwork: (itemId: string, approved: boolean, notes?: string) => void;
  onCancel: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [artworkNote, setArtworkNote] = useState("");

  const graphicItems = order.items.filter((i) => i.artworkUrl);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("text/plain", order.id);
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="bg-paper rounded-xl border border-rose-100 shadow-sm hover:shadow-md transition-all overflow-hidden cursor-grab active:cursor-grabbing"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-3 text-left flex items-start justify-between gap-2"
      >
        <div className="min-w-0 flex items-center gap-2">
          <GripVertical size={14} className="text-gray-200 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-gray-700 truncate">
              {order.orderNumber}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {order.user?.name || "Cliente"} &bull; {formatPrice(order.totalInCents)}
            </p>
          </div>
        </div>
        {expanded ? <ChevronUp size={14} className="text-gray-300 shrink-0 mt-1" /> : <ChevronDown size={14} className="text-gray-300 shrink-0 mt-1" />}
      </button>

      {expanded && (
        <div className="px-3 pb-3 space-y-2 border-t border-rose-50 pt-2">
          {graphicItems.map((item) => (
            <div key={item.id} className="p-2 bg-rose-50/50 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-600 truncate">
                  {item.productName}
                </span>
                <Badge
                  status={
                    item.artworkApproved === true
                      ? "ARTWORK_APPROVED"
                      : item.artworkApproved === false
                      ? "CANCELLED"
                      : "ARTWORK_UNDER_REVIEW"
                  }
                />
              </div>

              <div className="flex items-center gap-2">
                {item.artworkUrl && (
                  <a
                    href={item.artworkUrl}
                    target="_blank"
                    className="flex items-center gap-1 text-xs text-serenity-500 hover:text-serenity-600"
                  >
                    <Download size={12} /> Baixar Arte
                  </a>
                )}
                {item.artworkApproved === null && (
                  <>
                    <button
                      onClick={() => onApproveArtwork(item.id, true)}
                      className="flex items-center gap-1 text-xs text-mint-500 hover:text-mint-600"
                    >
                      <CheckCircle size={12} /> Aprovar
                    </button>
                    <button
                      onClick={() => {
                        const notes = prompt("Motivo da rejeição:");
                        if (notes !== null) onApproveArtwork(item.id, false, notes || undefined);
                      }}
                      className="flex items-center gap-1 text-xs text-red-400 hover:text-red-500"
                    >
                      <XCircle size={12} /> Rejeitar
                    </button>
                  </>
                )}
              </div>

              {item.artworkNotes && (
                <p className="text-[10px] text-gray-400 italic bg-white rounded-lg p-1.5">
                  Obs: {item.artworkNotes}
                </p>
              )}
            </div>
          ))}

          <div className="flex gap-2 pt-1">
            <select
              value={order.status}
              onChange={(e) => onStatusChange(order.id, e.target.value as OrderStatus)}
              className="flex-1 text-xs px-2 py-1.5 rounded-lg border border-rose-100 bg-paper focus:outline-none focus:border-rose-300"
            >
              {columns.map((col) => (
                <option key={col.status} value={col.status}>
                  {col.label}
                </option>
              ))}
              <option value="SHIPPED">Enviado</option>
              <option value="DELIVERED">Entregue</option>
            </select>
            {order.status !== "CANCELLED" && order.status !== "REFUNDED" && (
              <button
                onClick={() => onCancel(order.id)}
                className="px-2 py-1 text-xs text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                title="Cancelar pedido"
              >
                <Ban size={14} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function KanbanBoard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const dragItem = useRef<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) { setLoading(false); return; }

      const res = await fetch(`${API_BASE_URL}/orders/kanban`, {
        cache: "no-store",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Erro na requisição" }));
        throw new Error(err.message || `HTTP ${res.status}`);
      }

      const data = await res.json();
      console.log("[Kanban] Dados recebidos:", data);
      setOrders(data || []);
    } catch (err) {
      console.error("Erro ao carregar kanban:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleStatusChange = async (id: string, newStatus: OrderStatus) => {
    const previous = orders;
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Falha ao atualizar");
      toast.success("Status atualizado");
    } catch {
      setOrders(previous);
      toast.error("Erro ao atualizar status");
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm("Cancelar este pedido?")) return;
    const previous = orders;
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: "CANCELLED" as OrderStatus } : o))
    );

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
      if (!res.ok) throw new Error("Falha ao cancelar");
      toast.success("Pedido cancelado");
    } catch {
      setOrders(previous);
      toast.error("Erro ao cancelar pedido");
    }
  };

  const handleApproveArtwork = async (
    itemId: string,
    approved: boolean,
    notes?: string
  ) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/orders/items/${itemId}/artwork`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ approved, notes }),
      });
      if (!res.ok) throw new Error("Falha");
      toast.success(approved ? "Arte aprovada" : "Arte rejeitada");
      load();
    } catch {
      toast.error("Erro ao aprovar/rejeitar arte");
    }
  };

  const handleDragOver = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumn(status);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, newStatus: OrderStatus) => {
    e.preventDefault();
    setDragOverColumn(null);
    const orderId = e.dataTransfer.getData("text/plain");
    if (!orderId) return;
    handleStatusChange(orderId, newStatus);
  };

  if (loading) {
    return (
      <div className="text-center py-12 text-gray-400">Carregando quadro Kanban...</div>
    );
  }

  const allEmpty = columns.every(
    (col) => orders.filter((o) => o.status === col.status).length === 0
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <KanbanSquare className="text-rose-400" size={24} />
          Kanban — Serviços Gráficos
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Arraste ou mova os pedidos entre as colunas de status
        </p>
      </div>

      {allEmpty ? (
        <div className="text-center py-16 card">
          <KanbanSquare size={48} className="text-rose-200 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">Nenhum pedido de serviço gráfico</p>
          <p className="text-xs text-gray-300 mt-1">
            Pedidos com arte aparecerão aqui automaticamente
          </p>
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin">
          {columns.map((column) => {
            const columnOrders = orders.filter((o) => o.status === column.status);
            const isOver = dragOverColumn === column.status;
            return (
              <div
                key={column.status}
                onDragOver={(e) => handleDragOver(e, column.status)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, column.status)}
                className={cn(
                  "bg-paper rounded-xl border-t-4 border-rose-100 p-3 transition-colors min-w-[280px] snap-start",
                  column.color,
                  isOver && "bg-rose-50/50"
                )}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-700">
                    {column.label}
                  </h3>
                  <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                    {columnOrders.length}
                  </span>
                </div>
                <div className="space-y-2 min-h-[200px]">
                  {columnOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onStatusChange={handleStatusChange}
                      onApproveArtwork={handleApproveArtwork}
                      onCancel={handleCancel}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
