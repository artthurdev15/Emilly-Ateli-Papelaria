"use client";

import { useEffect, useState } from "react";
import {
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { formatPrice, formatDateShort, API_BASE_URL } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface RecentOrder {
  id: string;
  orderNumber: string;
  totalInCents: number;
  status: string;
  createdAt: string;
  customerName: string;
}

interface TopProduct {
  productName: string;
  quantity: number;
}

interface MonthlySerie {
  month: string;
  revenue: number;
  orders: number;
}

interface DashboardData {
  totalProducts: number;
  newOrders: number;
  revenue: number;
  monthlyRevenue: number;
  pendingOrders: number;
  completedOrders: number;
  recentOrders: RecentOrder[];
  topProducts: TopProduct[];
  monthlySeries: MonthlySerie[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/admin/dashboard`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error("Erro ao carregar dashboard");
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message);
      }
    }
    load();
  }, []);

  const summaryCards = data
    ? [
        { label: "Faturamento do Mês", value: formatPrice(data.monthlyRevenue), change: "Pedidos entregues", icon: DollarSign, color: "from-mint-100 to-mint-50" },
        { label: "Pedidos Pendentes", value: String(data.pendingOrders), change: "Aguardando ação", icon: Clock, color: "from-yellow-100 to-yellow-50" },
        { label: "Pedidos Concluídos", value: String(data.completedOrders), change: "Este mês", icon: CheckCircle2, color: "from-serenity-100 to-serenity-50" },
        { label: "Total de Produtos", value: String(data.totalProducts), change: "Ativos", icon: Package, color: "from-rose-100 to-rose-50" },
      ]
    : error
      ? [{ label: "Erro de conexão", value: "--", change: "Offline", icon: AlertCircle, color: "from-gray-100 to-gray-50" }]
      : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-400 mt-1">Métricas financeiras e operacionais</p>
        {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((stat) => (
          <div key={stat.label} className="card overflow-hidden">
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                  <stat.icon size={20} className="text-gray-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-800 mt-4">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{stat.change}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-semibold text-gray-700 mb-4">Faturamento dos Últimos Meses</h3>
          {data?.monthlySeries ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data.monthlySeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9ca3af" }} />
                <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} tickFormatter={(v) => `R${(v / 100).toFixed(0)}`} />
                <Tooltip
                  formatter={(value: any) => [formatPrice(Number(value) || 0), "Receita"]}
                  contentStyle={{ borderRadius: "12px", border: "1px solid #fecdd3", fontSize: "12px" }}
                />
                <Bar dataKey="revenue" fill="#fb7185" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-gray-300 text-sm">Carregando...</div>
          )}
        </div>

        <div className="card p-6">
          <h3 className="font-semibold text-gray-700 mb-4">Produtos Mais Vendidos</h3>
          {data?.topProducts && data.topProducts.length > 0 ? (
            <div className="space-y-3">
              {data.topProducts.map((p, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-rose-100 text-rose-500 text-xs font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">{p.productName}</p>
                    <div className="w-full h-2 bg-rose-50 rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full bg-rose-300 rounded-full"
                        style={{ width: `${Math.min(100, (p.quantity / (data.topProducts[0]?.quantity || 1)) * 100)}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-600">{p.quantity} vendidos</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-300 text-sm">
              {data ? "Nenhum produto vendido ainda" : "Carregando..."}
            </div>
          )}
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-semibold text-gray-700 mb-4">Pedidos Recentes</h3>
        {!data ? (
          <div className="text-center py-8 text-gray-300 text-sm">Carregando...</div>
        ) : data.recentOrders.length === 0 ? (
          <div className="text-center py-8 text-gray-300 text-sm">Nenhum pedido recente</div>
        ) : (
          <div className="space-y-3">
            {data.recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/admin/pedidos/${order.id}`}
                className="flex items-center justify-between p-3 rounded-xl bg-rose-50/40 hover:bg-rose-50 transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <span className="font-semibold text-sm text-gray-700 shrink-0">{order.orderNumber}</span>
                  <span className="text-xs text-gray-400 truncate">{order.customerName}</span>
                  <span className="text-xs text-gray-400 shrink-0">{formatDateShort(order.createdAt)}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm font-semibold text-gray-600">{formatPrice(order.totalInCents)}</span>
                  <Badge status={order.status} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
