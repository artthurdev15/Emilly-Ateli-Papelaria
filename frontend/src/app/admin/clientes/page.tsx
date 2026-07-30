"use client";

import { useState, useEffect } from "react";
import { Users, Mail, Phone, Calendar, ShoppingBag, Trash2 } from "lucide-react";
import { formatDateShort, cn, API_BASE_URL } from "@/lib/utils";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  createdAt: string;
  _count: { orders: number };
}

export default function AdminClientesPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const limit = 20;

  const load = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_BASE_URL}/users?page=${page}&limit=${limit}`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      const data = await res.json();
      setClients(data.data || []);
      setTotal(data.total || 0);
    } catch {
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [page]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Excluir cliente "${name}"?`)) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_BASE_URL}/users/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      load();
    } catch {
      alert("Erro ao excluir cliente");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Users className="text-rose-400" /> Clientes
        </h1>
        <p className="text-sm text-gray-400 mt-1">{total} cliente(s) cadastrado(s)</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Carregando...</div>
      ) : clients.length === 0 ? (
        <div className="text-center py-16 card">
          <Users size={48} className="text-rose-200 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">Nenhum cliente encontrado</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-rose-100 bg-rose-50/50">
                  <th className="text-left px-4 py-3 font-semibold text-gray-500">Cliente</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500">Contato</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500">Cadastro</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-500">Pedidos</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-500">Tipo</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-500">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-50">
                {clients.map((client) => (
                  <tr key={client.id} className="hover:bg-rose-50/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-700">{client.name}</td>
                    <td className="px-4 py-3">
                      <div className="space-y-0.5">
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <Mail size={10} /> {client.email}
                        </p>
                        {client.phone && (
                          <p className="text-xs text-gray-400 flex items-center gap-1">
                            <Phone size={10} /> {client.phone}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">
                      {formatDateShort(client.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-gray-700">
                      {client._count?.orders || 0}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-semibold",
                          client.role === "ADMIN"
                            ? "bg-lilac-100 text-lilac-600"
                            : "bg-serenity-100 text-serenity-600"
                        )}
                      >
                        {client.role === "ADMIN" ? "Admin" : "Cliente"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(client.id, client.name)}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
