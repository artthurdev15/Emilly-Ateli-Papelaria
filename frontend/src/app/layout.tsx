import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: {
    default: "Emilly Ateliê & Papelaria",
    template: "%s | Emilly Ateliê & Papelaria",
  },
  description:
    "Papelaria personalizada, convites, lembrancinhas e serviços gráficos em João Pessoa. Feito com carinho para o seu evento especial.",
  openGraph: {
    title: "Emilly Ateliê & Papelaria",
    description:
      "Papelaria personalizada, convites, lembrancinhas e serviços gráficos em João Pessoa. Feito com carinho para o seu evento especial.",
    url: "https://emilyatele.com.br",
    siteName: "Emilly Ateliê & Papelaria",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Emilly Ateliê & Papelaria",
      },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <FloatingWhatsApp />
            <Toaster richColors position="top-right" />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
