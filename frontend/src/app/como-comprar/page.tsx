import { ShoppingBag } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Como Comprar | Emilly Ateliê e Papelaria",
  description: "Saiba como comprar em nossa loja",
};

export default function ComoComprarPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-10">
        <ShoppingBag size={48} className="text-rose-200 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800">Como Comprar</h1>
      </div>

      <p className="text-gray-500 leading-relaxed mb-8">
        Comprar com a gente é super fácil e o atendimento é humanizado para
        garantir que tudo saia do jeitinho que você sonhou! Veja como funciona:
      </p>

      <ol className="space-y-6">
        {[
          {
            step: "1",
            title: "Escolha seus favoritos",
            text: "Navegue pela nossa vitrine, escolha os produtos e adicione tudo ao seu carrinho.",
          },
          {
            step: "2",
            title: "Finalize o pedido",
            text: "Vá até o carrinho, confira seus itens e clique no botão para finalizar a compra.",
          },
          {
            step: "3",
            title: "Direto para o WhatsApp",
            text: "Você será redirecionado(a) automaticamente para o nosso WhatsApp. Não se preocupe, o resumo do seu carrinho vai junto na mensagem!",
          },
          {
            step: "4",
            title: "Atendimento personalizado",
            text: "Lá no WhatsApp, nós vamos conversar com você para definir todos os detalhes da personalização (nomes, temas, cores, etc.), acertar a forma de pagamento e combinar a entrega.",
          },
        ].map((item) => (
          <li key={item.step} className="flex gap-4">
            <span className="shrink-0 w-8 h-8 rounded-xl bg-rose-100 text-rose-500 font-bold text-sm flex items-center justify-center mt-0.5">
              {item.step}
            </span>
            <div>
              <h2 className="font-semibold text-gray-700">{item.title}</h2>
              <p className="text-sm text-gray-500 leading-relaxed mt-1">{item.text}</p>
            </div>
          </li>
        ))}
      </ol>

      <p className="text-gray-500 leading-relaxed mt-8 italic">
        Tudo feito com muito carinho e exclusividade para você!
      </p>
    </div>
  );
}
