"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

const slides = [
  {
    title: "Papelaria que\nconta histórias",
    subtitle: "Cadernos, agendas e convites personalizados com o seu estilo",
    cta: "Ver Produtos",
    href: "/produtos?categoria=papelaria",
    bg: "from-rose-100 via-rose-50 to-cream",
    accent: "rose",
  },
  {
    title: "Arte Digital\npara seu evento",
    subtitle: "Convites digitais e artes gráficas sob medida para qualquer ocasião",
    cta: "Serviços Gráficos",
    href: "/produtos?isService=true",
    bg: "from-lilac-100 via-lilac-50 to-cream",
    accent: "lilac",
  },
  {
    title: "Kits Festa\ncompletos",
    subtitle: "Tudo que você precisa em um só lugar, com a cara da sua festa",
    cta: "Ver Kits",
    href: "/produtos?categoria=kits",
    bg: "from-serenity-100 via-serenity-50 to-cream",
    accent: "serenity",
  },
];

export function HeroBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <section
      className={`relative overflow-hidden bg-gradient-to-br ${slide.bg} min-h-[70vh] lg:min-h-[80vh] flex items-center`}
    >
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-white blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-white blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
        <div className="max-w-2xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight whitespace-pre-line mb-6">
            {slide.title}
          </h1>
          <p className="text-lg sm:text-xl text-gray-500 mb-8 max-w-lg">
            {slide.subtitle}
          </p>
          <div className="flex gap-4">
            <Link href={slide.href}>
              <Button size="lg">{slide.cta}</Button>
            </Link>
            <Link href="/categorias">
              <Button variant="outline" size="lg">
                Categorias
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <button
        onClick={() => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/60 hover:bg-white text-gray-400 hover:text-rose-400 transition-all"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/60 hover:bg-white text-gray-400 hover:text-rose-400 transition-all"
      >
        <ChevronRight size={24} />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              i === current ? "bg-rose-300 w-8" : "bg-white/60 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
