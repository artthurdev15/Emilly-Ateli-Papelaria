import { Truck } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prazos e Entregas | Emilly Ateliê e Papelaria",
  description: "Prazos de produção e entrega dos nossos produtos",
};

export default function PrazosPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <Truck size={48} className="text-rose-200 mx-auto mb-4" />
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Prazos e Entregas</h1>
      <p className="text-gray-400">Página em construção</p>
    </div>
  );
}
