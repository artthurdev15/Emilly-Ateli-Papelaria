const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Erro inesperado" }));
    throw new Error(error.message || `Erro ${res.status}`);
  }

  return res.json();
}

export const api = {
  // ─── Auth ───
  login: (email: string, password: string) =>
    request<{ access_token: string; id: string; name: string; email: string; role: string }>(
      "/auth/login",
      { method: "POST", body: JSON.stringify({ email, password }) }
    ),

  register: (data: { email: string; password: string; name: string; cpfCnpj?: string; phone?: string }) =>
    request<{ access_token: string; id: string; name: string; email: string; role: string }>(
      "/auth/register",
      { method: "POST", body: JSON.stringify(data) }
    ),

  me: () => request<any>("/auth/me"),

  // ─── Produtos ───
  products: {
    list: (params?: Record<string, string>) => {
      const qs = params ? "?" + new URLSearchParams(params).toString() : "";
      return request<{ data: any[]; total: number; page: number; totalPages: number }>(
        `/products${qs}`
      );
    },
    get: (slug: string) => request<any>(`/products/${slug}`),
  },

  // ─── Categorias ───
  categories: {
    list: () => request<any[]>("/categories"),
  },

  // ─── Pedidos ───
  orders: {
    create: (data: any) =>
      request<any>("/orders", { method: "POST", body: JSON.stringify(data) }),

    my: (page = 1) => request<any>(`/orders/my?page=${page}`),

    get: (id: string) => request<any>(`/orders/${id}`),
  },

  // ─── Upload ───
  upload: async (file: File, type: "artwork" | "image" = "artwork") => {
    const token = localStorage.getItem("token");
    const form = new FormData();
    form.append("file", file);

    const res = await fetch(`${API_URL}/upload/${type}`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: "Erro no upload" }));
      throw new Error(error.message);
    }

    return res.json() as Promise<{ url: string; fileName: string }>;
  },
};
