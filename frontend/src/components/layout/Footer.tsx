"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Instagram, Mail, MapPin, MessageCircle } from "lucide-react";

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="bg-paper border-t border-rose-100 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <span className="font-script text-2xl text-rose-400">Emilly</span>
            <p className="text-sm text-gray-400 leading-relaxed">
              Ateliê de papelaria personalizada e serviços gráficos. Cada detalhe feito com{" "}
              <Heart size={14} className="inline text-rose-300" />
              {" "}para você.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-600 mb-3">Links</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <Link href="/produtos" className="block hover:text-rose-400 transition-colors">Produtos</Link>
                <Link href="/categorias" className="block hover:text-rose-400 transition-colors">Categorias</Link>
                <Link href="/carrinho" className="block hover:text-rose-400 transition-colors">Carrinho</Link>
                <Link href="/minha-conta/pedidos" className="block hover:text-rose-400 transition-colors">Meus Pedidos</Link>
              </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-600 mb-3">Ajuda</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <Link href="/faq" className="block hover:text-rose-400 transition-colors">FAQ</Link>
              <Link href="/como-comprar" className="block hover:text-rose-400 transition-colors">Como Comprar</Link>
              <Link href="/prazos" className="block hover:text-rose-400 transition-colors">Prazos e Entregas</Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-600 mb-3">Contato</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <a
                href="https://www.instagram.com/emilly_atelie_e_papelaria/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-rose-400 transition-colors"
              >
                <Instagram size={14} /> @emilly_atelie_e_papelaria
              </a>
              <a
                href="mailto:Emilly.grafica@gmail.com"
                className="flex items-center gap-2 hover:text-rose-400 transition-colors"
              >
                <Mail size={14} /> Emilly.grafica@gmail.com
              </a>
              <a
                href="https://wa.me/5583991491382"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-rose-400 transition-colors"
              >
                <MessageCircle size={14} /> (83) 99149-1382
              </a>
              <p className="flex items-center gap-2">
                <MapPin size={14} /> João Pessoa, Paraíba
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-rose-100 text-center text-xs text-gray-300">
          <p>&copy; {new Date().getFullYear()} Emilly Ateliê & Papelaria. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
