"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function CadastroPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Senhas não conferem");
      return;
    }

    setLoading(true);
    try {
      const role = await register({ name: form.name, email: form.email, password: form.password });
      router.push(role === "ADMIN" ? "/admin" : "/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md card p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Criar Conta</h1>
          <p className="text-sm text-gray-400 mt-1">Faça parte da família Emilly!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Nome" value={form.name} onChange={update("name")} placeholder="Seu nome" required />
          <Input label="Email" type="email" value={form.email} onChange={update("email")} placeholder="seu@email.com" required />
          <Input label="Senha" type="password" value={form.password} onChange={update("password")} placeholder="Mínimo 6 caracteres" required />
          <Input label="Confirmar Senha" type="password" value={form.confirmPassword} onChange={update("confirmPassword")} placeholder="Repita a senha" required />

          {error && <p className="text-sm text-red-400 bg-red-50 p-3 rounded-xl">{error}</p>}

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "Cadastrando..." : "Criar Conta"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-400">
          Já tem conta?{" "}
          <Link href="/auth/login" className="text-rose-400 hover:text-rose-500 font-medium">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
