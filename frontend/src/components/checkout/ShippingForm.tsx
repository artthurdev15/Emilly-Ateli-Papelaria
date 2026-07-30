"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { MapPin, Truck } from "lucide-react";

interface ShippingFormProps {
  onCalculate: (cep: string) => void;
  shippingCost: number | null;
}

export function ShippingForm({ onCalculate, shippingCost }: ShippingFormProps) {
  const [cep, setCep] = useState("");

  return (
    <div className="card p-6 space-y-4">
      <h3 className="font-semibold text-gray-700 flex items-center gap-2">
        <Truck size={18} className="text-serenity-400" />
        Simular Frete
      </h3>

      <div className="flex gap-2">
        <Input
          placeholder="00000-000"
          value={cep}
          onChange={(e) => setCep(e.target.value)}
          maxLength={9}
        />
        <button
          onClick={() => onCalculate(cep)}
          className="px-4 py-2 bg-serenity-100 text-serenity-600 font-semibold rounded-xl hover:bg-serenity-200 transition-all shrink-0"
        >
          Calcular
        </button>
      </div>

      {shippingCost !== null && (
        <div className="p-3 bg-serenity-50 rounded-xl text-sm">
          {shippingCost === 0 ? (
            <p className="text-mint-500 font-medium">Frete Grátis!</p>
          ) : (
            <p className="text-gray-600">
              Frete: <strong>R$ {(shippingCost / 100).toFixed(2)}</strong>
            </p>
          )}
        </div>
      )}

      <hr className="border-rose-100" />

      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-600 flex items-center gap-2">
          <MapPin size={16} className="text-rose-300" />
          Endereço de Entrega
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <Input label="CEP" placeholder="00000-000" className="col-span-2 sm:col-span-1" />
          <Input label="Rua" placeholder="Nome da rua" className="col-span-2" />
          <Input label="Número" placeholder="123" />
          <Input label="Complemento" placeholder="Apto, bloco" />
          <Input label="Bairro" placeholder="Bairro" />
          <Input label="Cidade" placeholder="São Paulo" />
          <Input label="Estado" placeholder="SP" />
        </div>
      </div>
    </div>
  );
}
