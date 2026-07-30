"use client";

import { useState } from "react";
import { HelpCircle, ChevronDown, ShoppingCart, CreditCard, Image, Clock, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

const steps = [
  {
    icon: ShoppingCart,
    title: "1. Escolhendo os produtos",
    content:
      "Navegue pelas categorias, escolha os itens desejados e adicione ao carrinho.",
  },
  {
    icon: CreditCard,
    title: "2. Finalizando o Pedido",
    content:
      "Vá para o checkout, preencha seus dados de entrega e o seu número de WhatsApp. O seu pedido será salvo no nosso sistema.",
  },
  {
    icon: Image,
    title: "3. Como envio a arte ou tema?",
    content:
      "Após finalizar o pedido no site, você será redirecionado automaticamente para o nosso WhatsApp. É por lá que você deve nos enviar as informações de personalização! Mande o tema, nome, idade, fotos ou a arte pronta (se já tiver) para que possamos iniciar a produção.",
    highlight: true,
  },
  {
    icon: Clock,
    title: "4. Pagamento e Prazo",
    content:
      "O pagamento (Pix, etc.) e o cálculo exato do frete/prazo de entrega serão confirmados diretamente pelo WhatsApp após aprovarmos os detalhes da sua personalização.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-10">
        <HelpCircle size={48} className="text-rose-200 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800">Como funciona a Emilly Ateliê?</h1>
        <p className="text-gray-400 mt-2 text-sm">
          Um guia rápido para você aproveitar ao máximo sua experiência
        </p>
      </div>

      <div className="space-y-3">
        {steps.map((step, index) => {
          const isOpen = openIndex === index;
          const Icon = step.icon;

          return (
            <div
              key={index}
              className={`rounded-2xl border-2 overflow-hidden transition-all ${
                step.highlight && isOpen
                  ? "border-lilac-300 bg-lilac-50/50"
                  : isOpen
                    ? "border-rose-200 bg-rose-50/30"
                    : "border-rose-100 bg-paper hover:border-rose-200"
              }`}
            >
              <button
                onClick={() => toggle(index)}
                className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      step.highlight
                        ? "bg-lilac-100 text-lilac-500"
                        : "bg-rose-100 text-rose-400"
                    }`}
                  >
                    <Icon size={18} />
                  </div>
                  <span className="font-semibold text-sm text-gray-700">
                    {step.title}
                  </span>
                </div>
                <ChevronDown
                  size={18}
                  className={`shrink-0 text-gray-300 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 pt-0 text-sm text-gray-500 leading-relaxed">
                  {step.content}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="text-center mt-10">
        <a
          href="https://wa.me/5583991491382"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="primary" size="lg">
            <MessageCircle size={18} /> Ainda tem dúvidas? Fale com a gente no WhatsApp
          </Button>
        </a>
      </div>
    </div>
  );
}
