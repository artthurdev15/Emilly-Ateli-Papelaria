"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, User, Menu, X, Heart, Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

  return (
    <nav className="sticky top-0 z-50 bg-paper/80 backdrop-blur-md border-b border-rose-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-script text-2xl lg:text-3xl text-rose-400">
              Emilly
            </span>
            <span className="hidden sm:inline text-sm text-gray-400 mt-2">
              Ateliê & Papelaria
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-500 hover:text-rose-400 transition-colors text-sm font-medium">
              Início
            </Link>
            <Link href="/produtos" className="text-gray-500 hover:text-rose-400 transition-colors text-sm font-medium">
              Produtos
            </Link>
            <Link href="/categorias" className="text-gray-500 hover:text-rose-400 transition-colors text-sm font-medium">
              Categorias
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-400 hover:text-rose-400 transition-colors">
              <Search size={20} />
            </button>

            <Link
              href="/carrinho"
              className="relative p-2 text-gray-400 hover:text-rose-400 transition-colors"
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-rose-400 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {totalItems}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 p-2 text-gray-400 hover:text-rose-400 transition-colors">
                  <User size={20} />
                  <span className="hidden lg:inline text-sm text-gray-500">{user.name.split(" ")[0]}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-paper rounded-2xl shadow-lg border border-rose-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="p-2 space-y-1">
                    <Link href="/minha-conta" className="block px-4 py-2 text-sm text-gray-600 hover:bg-rose-50 rounded-xl">
                      Minha Conta
                    </Link>
                    <Link href="/minha-conta/pedidos" className="block px-4 py-2 text-sm text-gray-600 hover:bg-rose-50 rounded-xl">
                      Meus Pedidos
                    </Link>
                    {user.role === "ADMIN" && (
                      <>
                        <hr className="border-rose-100 my-1" />
                        <Link href="/admin" className="block px-4 py-2 text-sm font-semibold text-rose-400 hover:bg-rose-50 rounded-xl">
                          Painel Admin
                        </Link>
                      </>
                    )}
                    <hr className="border-rose-100 my-1" />
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-400 hover:bg-rose-50 rounded-xl"
                    >
                      Sair
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link href="/auth/login">
                <Button variant="primary" size="sm">
                  Entrar
                </Button>
              </Link>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-rose-400"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-rose-100 bg-paper">
          <div className="px-4 py-4 space-y-3">
            <Link href="/" className="block text-gray-600 hover:text-rose-400" onClick={() => setIsOpen(false)}>
              Início
            </Link>
            <Link href="/produtos" className="block text-gray-600 hover:text-rose-400" onClick={() => setIsOpen(false)}>
              Produtos
            </Link>
            <Link href="/categorias" className="block text-gray-600 hover:text-rose-400" onClick={() => setIsOpen(false)}>
              Categorias
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
