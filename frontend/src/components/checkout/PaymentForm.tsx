"use client";

import { CreditCard, Banknote, QrCode } from "lucide-react";

const methods = [
  { id: "pix", label: "Pix", icon: QrCode },
  { id: "credit", label: "Cartão de Crédito", icon: CreditCard },
  { id: "boleto", label: "Boleto Bancário", icon: Banknote },
];

interface PaymentFormProps {
  value: string;
  onChange: (value: string) => void;
}

export function PaymentForm({ value, onChange }: PaymentFormProps) {
  return (
    <div className="card p-6 space-y-4">
      <h3 className="font-semibold text-gray-700 flex items-center gap-2">
        <CreditCard size={18} className="text-rose-400" />
        Forma de Pagamento
      </h3>

      <div className="space-y-2">
        {methods.map(({ id, label, icon: Icon }) => (
          <label
            key={id}
            className="flex items-center gap-3 p-4 rounded-xl border-2 border-rose-100 has-[:checked]:border-rose-300 has-[:checked]:bg-rose-50 cursor-pointer transition-all"
          >
            <input
              type="radio"
              name="payment"
              value={id}
              checked={value === id}
              onChange={(e) => onChange(e.target.value)}
              className="accent-rose-400 w-4 h-4"
            />
            <Icon size={20} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-600">{label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
