"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Save,
  Package,
  Image as ImageIcon,
  X,
  Upload,
  ArrowLeft,
  AlertCircle,
  Palette,
} from "lucide-react";
import { slugify, API_BASE_URL } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface ProductFormProps {
  productId?: string;
}

export function ProductForm({ productId }: ProductFormProps) {
  const router = useRouter();
  const isEditing = !!productId;
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    sku: "",
    description: "",
    shortDescription: "",
    priceInCents: "",
    comparePriceInCents: "",
    costInCents: "",
    stock: "0",
    isService: false,
    requiresAttachment: false,
    attachmentInstructions: "",
    weightGrams: "",
    lengthCm: "",
    widthCm: "",
    heightCm: "",
    isActive: true,
    featured: false,
    categoryIds: [] as string[],
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

    fetch(`${API_BASE_URL}/categories/admin`, { headers })
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => {});

    if (isEditing && productId) {
      fetch(`${API_BASE_URL}/products/${productId}`, { headers })
        .then((r) => r.json())
        .then((p) => {
          setForm({
            name: p.name,
            slug: p.slug,
            sku: p.sku,
            description: p.description || "",
            shortDescription: p.shortDescription || "",
            priceInCents: String(p.priceInCents),
            comparePriceInCents: p.comparePriceInCents ? String(p.comparePriceInCents) : "",
            costInCents: p.costInCents ? String(p.costInCents) : "",
            stock: String(p.stock),
            isService: p.isService,
            requiresAttachment: p.requiresAttachment,
            attachmentInstructions: p.attachmentInstructions || "",
            weightGrams: p.weightGrams ? String(p.weightGrams) : "",
            lengthCm: p.lengthCm ? String(p.lengthCm) : "",
            widthCm: p.widthCm ? String(p.widthCm) : "",
            heightCm: p.heightCm ? String(p.heightCm) : "",
            isActive: p.isActive,
            featured: p.featured,
            categoryIds: p.categories?.map((pc: any) => pc.category.id) || [],
          });
          setUploadedImages(p.images?.map((i: any) => i.url) || []);
        })
        .catch(() => setError("Erro ao carregar produto"));
    }
  }, [isEditing, productId]);

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
    setForm((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "name" && !isEditing ? { slug: slugify(value as string) } : {}),
    }));
  };

  const toggleCategory = (id: string) => {
    setForm((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(id)
        ? prev.categoryIds.filter((c) => c !== id)
        : [...prev.categoryIds, id],
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`${API_BASE_URL}/upload/image`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Erro no upload" }));
        throw new Error(err.message || "Erro no upload");
      }
      const data = await res.json();
      setUploadedImages((prev) => [...prev, data.url]);
    } catch (err: any) {
      setError(err.message || "Erro ao fazer upload da imagem");
    }
  };

  const removeImage = (idx: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    const body: any = {
      name: form.name,
      slug: form.slug,
      sku: form.sku,
      description: form.description || undefined,
      shortDescription: form.shortDescription || undefined,
      priceInCents: parseInt(form.priceInCents, 10),
      comparePriceInCents: form.comparePriceInCents ? parseInt(form.comparePriceInCents, 10) : undefined,
      costInCents: form.costInCents ? parseInt(form.costInCents, 10) : undefined,
      stock: parseInt(form.stock, 10) || 0,
      isService: form.isService,
      requiresAttachment: form.requiresAttachment,
      attachmentInstructions: form.attachmentInstructions || undefined,
      weightGrams: form.weightGrams ? parseInt(form.weightGrams, 10) : undefined,
      lengthCm: form.lengthCm ? parseInt(form.lengthCm, 10) : undefined,
      widthCm: form.widthCm ? parseInt(form.widthCm, 10) : undefined,
      heightCm: form.heightCm ? parseInt(form.heightCm, 10) : undefined,
      isActive: form.isActive,
      featured: form.featured,
      categoryIds: form.categoryIds.length > 0 ? form.categoryIds : undefined,
      imageUrls: uploadedImages.length > 0 ? uploadedImages : undefined,
    };

    try {
      const token = localStorage.getItem("token");
      const url = isEditing
        ? `${API_BASE_URL}/products/${productId}`
        : `${API_BASE_URL}/products`;
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Erro ao salvar");
      }

      router.push("/admin/produtos");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-rose-400 mb-2 transition-colors"
          >
            <ArrowLeft size={14} /> Voltar
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            {isEditing ? "Editar Produto" : "Novo Produto"}
          </h1>
        </div>
        <Button type="submit" disabled={saving}>
          <Save size={16} /> {saving ? "Salvando..." : "Salvar"}
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 rounded-xl text-sm text-red-400">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6 space-y-4">
            <h3 className="font-semibold text-gray-700 flex items-center gap-2">
              <Package size={16} className="text-rose-400" /> Informações Básicas
            </h3>

            <Input label="Nome do Produto" value={form.name} onChange={update("name")} placeholder="Ex: Convite Digital Personalizado" required />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Slug" value={form.slug} onChange={update("slug")} placeholder="convite-digital" required />
              <Input label="SKU" value={form.sku} onChange={update("sku")} placeholder="CONV-001" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Descrição Curta</label>
              <input
                value={form.shortDescription}
                onChange={update("shortDescription")}
                className="w-full px-4 py-3 rounded-xl border-2 border-rose-100 bg-paper text-gray-700 focus:outline-none focus:border-rose-300 transition-all"
                placeholder="Breve descrição para vitrine"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Descrição Completa</label>
              <textarea
                value={form.description}
                onChange={update("description")}
                rows={5}
                className="w-full px-4 py-3 rounded-xl border-2 border-rose-100 bg-paper text-gray-700 focus:outline-none focus:border-rose-300 transition-all resize-none"
                placeholder="Descrição detalhada do produto..."
              />
            </div>
          </div>

          <div className="card p-6 space-y-4">
            <h3 className="font-semibold text-gray-700">Precificação</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <Input label="Preço (centavos)" type="number" value={form.priceInCents} onChange={update("priceInCents")} placeholder="2990" required />
              <Input label="Preço Comparativo" type="number" value={form.comparePriceInCents} onChange={update("comparePriceInCents")} placeholder="3990" />
              <Input label="Custo (centavos)" type="number" value={form.costInCents} onChange={update("costInCents")} placeholder="1500" />
            </div>
          </div>

          <div className="card p-6 space-y-4">
            <h3 className="font-semibold text-gray-700">Dimensões para Frete</h3>
            <p className="text-xs text-gray-400">Informe o peso e as dimensões da embalagem em centímetros.</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Input label="Peso (gramas)" type="number" value={form.weightGrams} onChange={update("weightGrams")} placeholder="500" />
              <Input label="Comprimento (cm)" type="number" value={form.lengthCm} onChange={update("lengthCm")} placeholder="30" />
              <Input label="Largura (cm)" type="number" value={form.widthCm} onChange={update("widthCm")} placeholder="20" />
              <Input label="Altura (cm)" type="number" value={form.heightCm} onChange={update("heightCm")} placeholder="5" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6 space-y-4">
            <h3 className="font-semibold text-gray-700">Imagens</h3>
            <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-rose-200 rounded-xl cursor-pointer hover:border-rose-300 hover:bg-rose-50/50 transition-all">
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              <Upload size={24} className="text-rose-300 mb-2" />
              <span className="text-sm text-gray-500">Adicionar imagem</span>
            </label>
            {uploadedImages.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {uploadedImages.map((url, i) => (
                  <div key={i} className="relative group aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-rose-50 to-lilac-50">
                    <Image src={url} alt="" fill className="object-cover" sizes="200px" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 p-1 bg-white/80 rounded-full text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card p-6 space-y-4">
            <h3 className="font-semibold text-gray-700">Status & Estoque</h3>
            <Input label="Estoque" type="number" value={form.stock} onChange={update("stock")} />
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.isActive} onChange={update("isActive")} className="accent-rose-400 w-4 h-4" />
              <span className="text-sm text-gray-600">Produto Ativo</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={update("featured")} className="accent-rose-400 w-4 h-4" />
              <span className="text-sm text-gray-600">Destacar na Loja</span>
            </label>
          </div>

          <div className="card p-6 space-y-4">
            <h3 className="font-semibold text-gray-700 flex items-center gap-2">
              <Palette size={16} className="text-lilac-400" /> Serviço Gráfico
            </h3>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.isService} onChange={update("isService")} className="accent-lilac-400 w-4 h-4" />
              <span className="text-sm text-gray-600">É um serviço gráfico</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.requiresAttachment} onChange={update("requiresAttachment")} className="accent-lilac-400 w-4 h-4" />
              <span className="text-sm text-gray-600">Exige upload de arte</span>
            </label>
            {form.requiresAttachment && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Instruções para o Cliente</label>
                <textarea
                  value={form.attachmentInstructions}
                  onChange={update("attachmentInstructions")}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border-2 border-lilac-100 bg-paper text-sm focus:outline-none focus:border-lilac-300 transition-all resize-none"
                  placeholder="Ex: Envie o arquivo em PNG ou PDF, resolução mínima 300dpi..."
                />
              </div>
            )}
          </div>

          <div className="card p-6 space-y-3">
            <h3 className="font-semibold text-gray-700">Categorias</h3>
            {categories.length === 0 ? (
              <p className="text-xs text-gray-400">Nenhuma categoria disponível</p>
            ) : (
              categories.map((cat) => (
                <label key={cat.id} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.categoryIds.includes(cat.id)}
                    onChange={() => toggleCategory(cat.id)}
                    className="accent-rose-400 w-4 h-4"
                  />
                  <span className="text-sm text-gray-600">{cat.name}</span>
                </label>
              ))
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
