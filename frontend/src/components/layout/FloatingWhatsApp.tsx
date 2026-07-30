"use client";

import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";

const WHATSAPP_URL =
  "https://wa.me/5583991491382?text=Ol%C3%A1%2C%20Emilly%20Ateli%C3%AA%21%20Estava%20vendo%20o%20site%20e%20tenho%20uma%20d%C3%BAvida.";

export function FloatingWhatsApp() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-3 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-all hover:scale-105"
      aria-label="Fale conosco no WhatsApp"
    >
      <MessageCircle size={22} />
      <span className="text-sm font-semibold hidden sm:inline">Fale Conosco</span>
    </a>
  );
}
