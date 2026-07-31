import { Truck } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prazos e Entregas | Emilly Ateliê e Papelaria",
  description: "Prazos de produção e entrega dos nossos produtos",
};

export default function PrazosPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-10">
        <Truck size={48} className="text-rose-200 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800">Prazos e Entregas</h1>
      </div>

      <p className="text-gray-500 leading-relaxed mb-8">
        Sabemos que a ansiedade para receber produtos personalizados é grande!
        Como nosso trabalho é artesanal e feito sob medida para cada cliente, nós
        trabalhamos da seguinte forma:
      </p>

      <div className="space-y-8">
        <div className="p-6 bg-rose-50/50 rounded-2xl border border-rose-100">
          <h2 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span className="text-lg">📦</span> Prazos de Produção
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            O tempo que levamos para produzir o seu pedido varia de acordo com a
            complexidade da arte, o tipo de produto e a quantidade escolhida. Por
            isso, o prazo exato para a entrega do seu pedido será informado e
            combinado diretamente com você no nosso WhatsApp, logo após a
            confirmação dos detalhes.
          </p>
        </div>

        <div className="p-6 bg-serenity-50/50 rounded-2xl border border-serenity-100">
          <h2 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span className="text-lg">🛵</span> Entregas (João Pessoa - PB)
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-4">
            Para clientes de João Pessoa e região, oferecemos as seguintes
            opções:
          </p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-sm text-gray-500">
              <span className="shrink-0 w-6 h-6 rounded-lg bg-rose-100 text-rose-500 text-xs font-bold flex items-center justify-center mt-0.5">
                1
              </span>
              <div>
                <strong className="text-gray-700">Retirada no Ateliê:</strong>{" "}
                Você pode vir buscar sua encomenda pessoalmente quando estiver
                prontinha.
              </div>
            </li>
            <li className="flex items-start gap-3 text-sm text-gray-500">
              <span className="shrink-0 w-6 h-6 rounded-lg bg-rose-100 text-rose-500 text-xs font-bold flex items-center justify-center mt-0.5">
                2
              </span>
              <div>
                <strong className="text-gray-700">Entrega via Motoboy:</strong>{" "}
                Enviamos para o seu endereço (a taxa de entrega é calculada de
                acordo com o seu bairro no momento do fechamento no WhatsApp).
              </div>
            </li>
          </ul>
        </div>
      </div>

      <p className="text-gray-500 leading-relaxed mt-8 italic">
        Tem urgência ou quer saber uma estimativa antes de fechar o carrinho? É
        só chamar a gente no botão de WhatsApp flutuante no canto da tela!
      </p>
    </div>
  );
}
