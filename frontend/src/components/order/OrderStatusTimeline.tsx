"use client";

import { CheckCircle, Circle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDateShort } from "@/lib/utils";
import type { OrderStatus, OrderHistory } from "@/types";

const steps: { status: OrderStatus; label: string }[] = [
  { status: "PENDING_PAYMENT", label: "Pedido Recebido" },
  { status: "AWAITING_ARTWORK", label: "Aguardando Arte" },
  { status: "ARTWORK_UNDER_REVIEW", label: "Arte em Análise" },
  { status: "ARTWORK_APPROVED", label: "Arte Aprovada" },
  { status: "CONFIRMED", label: "Confirmado" },
  { status: "IN_PRODUCTION", label: "Em Produção" },
  { status: "SHIPPED", label: "Enviado" },
  { status: "DELIVERED", label: "Entregue" },
];

const statusOrder: Record<string, number> = {
  PENDING_PAYMENT: 0,
  AWAITING_ARTWORK: 1,
  ARTWORK_UNDER_REVIEW: 2,
  ARTWORK_APPROVED: 3,
  CONFIRMED: 4,
  IN_PRODUCTION: 5,
  SHIPPED: 6,
  DELIVERED: 7,
  CANCELLED: -1,
  REFUNDED: -1,
};

export function OrderStatusTimeline({
  currentStatus,
  history,
}: {
  currentStatus: OrderStatus;
  history: OrderHistory[];
}) {
  const currentIdx = statusOrder[currentStatus] ?? 0;
  const isCancelled = currentStatus === "CANCELLED" || currentStatus === "REFUNDED";

  const historyMap = new Map<string, OrderHistory>();
  history.forEach((h) => {
    if (!historyMap.has(h.status)) historyMap.set(h.status, h);
  });

  const visibleSteps = isCancelled
    ? steps.slice(0, currentIdx + 1)
    : steps.slice(0, currentIdx + 1);

  return (
    <div className="card p-6">
      <h3 className="font-semibold text-gray-700 mb-6">Status do Pedido</h3>

      {isCancelled ? (
        <div className="p-4 bg-red-50 rounded-xl text-center">
          <p className="text-red-500 font-semibold">
            {currentStatus === "CANCELLED" ? "Pedido Cancelado" : "Pedido Reembolsado"}
          </p>
          {history.find((h) => h.status === currentStatus)?.note && (
            <p className="text-sm text-gray-400 mt-1">
              {history.find((h) => h.status === currentStatus)?.note}
            </p>
          )}
        </div>
      ) : (
        <div className="relative">
          <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-rose-100" />

          <div className="space-y-6">
            {visibleSteps.map((step, i) => {
              const stepHistory = historyMap.get(step.status);
              const isCompleted = i <= currentIdx;
              const isCurrent = i === currentIdx;

              return (
                <div key={step.status} className="relative flex items-start gap-4">
                  <div className="relative z-10">
                    {isCompleted ? (
                      <CheckCircle
                        size={24}
                        className={cn(
                          "shrink-0",
                          isCurrent ? "text-rose-400" : "text-mint-400"
                        )}
                      />
                    ) : (
                      <Circle size={24} className="text-gray-200 shrink-0" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <p
                      className={cn(
                        "text-sm font-medium",
                        isCompleted ? "text-gray-700" : "text-gray-300"
                      )}
                    >
                      {step.label}
                    </p>
                    {stepHistory && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {formatDateShort(stepHistory.createdAt)}
                        {stepHistory.note && stepHistory.note !== `Status alterado para ${step.status}` && (
                          <span className="block text-gray-300 mt-0.5 italic">
                            "{stepHistory.note}"
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
