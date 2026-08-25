"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  AlertCircle,
  Palette,
  Package,
} from "lucide-react";
import { formatPrice, cn, API_BASE_URL, resolveImageUrl } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  priceInCents: number;
  stock: number;
  isService: boolean;
  isActive: boolean;
  images: { url: string }[];
  categories: { category: { name: string } }[];
  _count?: { orderItems: number };
}

export function ProductTable() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const limit = 15;

  const load = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (search) params.set("search", search);

      const res = await fetch(
        `${API_BASE_URL}/products/admin?${params}`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      const data = await res.json();
      setProducts(data.data || []);
      setTotal(data.total || 0);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [page, search]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Excluir "${name}"? Esta ação não pode ser desfeita.`)) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_BASE_URL}/products/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      load();
    } catch (err) {
      alert("Erro ao excluir produto");
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Produtos</h1>
          <p className="text-sm text-gray-400">{total} produto(s) cadastrado(s)</p>
        </div>
        <Link href="/admin/produtos/novo">
          <Button>
            <Plus size={16} /> Novo Produto
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
          <input
            placeholder="Buscar por nome ou SKU..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-rose-100 bg-paper text-sm focus:outline-none focus:border-rose-300 transition-all"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Carregando...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-16">
          <Package size={48} className="text-rose-200 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">Nenhum produto encontrado</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-rose-100 bg-rose-50/50">
                  <th className="text-left px-4 py-3 font-semibold text-gray-500">Produto</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500">SKU</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500">Preço</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-500">Estoque</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-500">Status</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-500">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-50">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-rose-50/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-rose-50 to-lilac-50 shrink-0 overflow-hidden">
                          {p.images?.[0] ? (
                            <Image src={resolveImageUrl(p.images[0].url)} alt="" fill className="object-cover" sizes="40px" />
                          ) : (
                            <Package size={16} className="text-rose-300" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/admin/produtos/${p.id}/edit`}
                            className="font-medium text-gray-700 hover:text-rose-400 truncate block"
                          >
                            {p.name}
                          </Link>
                          {p.isService && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-lilac-500 bg-lilac-50 px-1.5 py-0.5 rounded-full mt-0.5">
                              <Palette size={8} /> Serviço
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">{p.sku}</td>
                    <td className="px-4 py-3 font-semibold text-gray-700">{formatPrice(p.priceInCents)}</td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={cn(
                          "text-sm font-medium",
                          p.stock <= 0 && !p.isService
                            ? "text-red-400"
                            : p.stock <= 5
                            ? "text-amber-400"
                            : "text-mint-500"
                        )}
                      >
                        {p.isService ? "∞" : p.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={cn(
                          "inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold",
                          p.isActive
                            ? "bg-mint-100 text-mint-600"
                            : "bg-gray-100 text-gray-400"
                        )}
                      >
                        {p.isActive ? "Ativo" : "Rascunho"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/produtos/${p.id}/edit`}
                          className="p-2 text-gray-400 hover:text-serenity-500 hover:bg-serenity-50 rounded-lg transition-all"
                        >
                          <Edit size={14} />
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-rose-100">
              <span className="text-xs text-gray-400">
                Página {page} de {totalPages}
              </span>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={cn(
                      "w-8 h-8 rounded-lg text-xs font-medium transition-all",
                      p === page
                        ? "bg-rose-100 text-rose-500"
                        : "text-gray-400 hover:bg-gray-100"
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
