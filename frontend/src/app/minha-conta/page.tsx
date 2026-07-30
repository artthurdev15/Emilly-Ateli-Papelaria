"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Package, Heart, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";

export default function MinhaContaPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) router.push("/auth/login");
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-gray-400">
        Carregando...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-100 to-lilac-100 flex items-center justify-center">
          <User size={28} className="text-rose-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Olá, {user.name.split(" ")[0]}</h1>
          <p className="text-sm text-gray-400">{user.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/minha-conta/pedidos"
          className="card-hover p-6 flex items-center gap-4"
        >
          <div className="p-3 bg-serenity-100 rounded-xl">
            <Package size={24} className="text-serenity-500" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-700">Meus Pedidos</h3>
            <p className="text-sm text-gray-400">Acompanhe seus pedidos</p>
          </div>
        </Link>

        <Link
          href="/minha-conta/favoritos"
          className="card-hover p-6 flex items-center gap-4"
        >
          <div className="p-3 bg-rose-100 rounded-xl">
            <Heart size={24} className="text-rose-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-700">Favoritos</h3>
            <p className="text-sm text-gray-400">Seus produtos favoritos</p>
          </div>
        </Link>

        <Link
          href="/minha-conta/configuracoes"
          className="card-hover p-6 flex items-center gap-4"
        >
          <div className="p-3 bg-lilac-100 rounded-xl">
            <Settings size={24} className="text-lilac-500" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-700">Configurações</h3>
            <p className="text-sm text-gray-400">Editar dados pessoais</p>
          </div>
        </Link>

        <button
          onClick={logout}
          className="card-hover p-6 flex items-center gap-4 text-left"
        >
          <div className="p-3 bg-gray-100 rounded-xl">
            <LogOut size={24} className="text-gray-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-700">Sair</h3>
            <p className="text-sm text-gray-400">Desconectar da conta</p>
          </div>
        </button>
      </div>
    </div>
  );
}
