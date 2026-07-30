"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Tags, Plus, Edit2, Trash2, Save, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { slugify, API_BASE_URL } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  parent: { id: string; name: string } | null;
  _count: { products: number };
}

export default function AdminCategoriasPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [editName, setEditName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/categories/admin`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      setCategories(data || []);
    } catch {
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setError("");
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ name: newName, slug: slugify(newName) }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
      }
      setNewName("");
      toast.success("Categoria criada");
      load();
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return;
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ name: editName, slug: slugify(editName) }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
      }
      setEditingId(null);
      toast.success("Categoria atualizada");
      load();
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Excluir categoria "${name}"?`)) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("Erro ao excluir");
      toast.success("Categoria excluída");
      load();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditName(cat.name);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Tags className="text-rose-400" /> Categorias
        </h1>
        <p className="text-sm text-gray-400 mt-1">{categories.length} categoria(s)</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 rounded-xl text-sm text-red-400">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <div className="flex items-center gap-2">
        <Input
          placeholder="Nova categoria..."
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
        />
        <Button onClick={handleCreate} disabled={!newName.trim() || submitting}>
          {submitting ? "Salvando..." : <><Plus size={16} /> Adicionar</>}
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-400">Carregando...</div>
      ) : (
        <div className="space-y-2">
          {categories.map((cat) => (
            <div key={cat.id} className="card p-4 flex items-center justify-between gap-4">
              {editingId === cat.id ? (
                <div className="flex-1 flex items-center gap-2">
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg border-2 border-rose-200 bg-paper text-sm focus:outline-none focus:border-rose-300"
                    autoFocus
                    onKeyDown={(e) => e.key === "Enter" && handleUpdate(cat.id)}
                  />
                  <button onClick={() => handleUpdate(cat.id)} className="p-1.5 text-mint-500 hover:bg-mint-50 rounded-lg">
                    <Save size={14} />
                  </button>
                  <button onClick={() => setEditingId(null)} className="p-1.5 text-gray-400 hover:bg-gray-50 rounded-lg">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex-1">
                    <p className="font-medium text-gray-700">{cat.name}</p>
                    <p className="text-xs text-gray-400">
                      slug: {cat.slug} &bull; {cat._count?.products || 0} produtos
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => startEdit(cat)} className="p-2 text-gray-400 hover:text-serenity-500 hover:bg-serenity-50 rounded-lg transition-all">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => handleDelete(cat.id, cat.name)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-50 rounded-lg transition-all">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
