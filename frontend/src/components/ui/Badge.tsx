import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  PENDING_PAYMENT: "bg-yellow-100 text-yellow-700",
  AWAITING_ARTWORK: "bg-lilac-100 text-lilac-700",
  ARTWORK_UNDER_REVIEW: "bg-serenity-100 text-serenity-700",
  ARTWORK_APPROVED: "bg-mint-100 text-mint-700",
  CONFIRMED: "bg-serenity-200 text-serenity-800",
  IN_PRODUCTION: "bg-lilac-200 text-lilac-800",
  SHIPPED: "bg-rose-200 text-rose-800",
  DELIVERED: "bg-mint-200 text-mint-800",
  CANCELLED: "bg-gray-100 text-gray-500",
  REFUNDED: "bg-gray-100 text-gray-500",
};

const labels: Record<string, string> = {
  PENDING_PAYMENT: "Aguardando Pagamento",
  AWAITING_ARTWORK: "Aguardando Arte",
  ARTWORK_UNDER_REVIEW: "Arte em Análise",
  ARTWORK_APPROVED: "Arte Aprovada",
  CONFIRMED: "Confirmado",
  IN_PRODUCTION: "Em Produção",
  SHIPPED: "Enviado",
  DELIVERED: "Entregue",
  CANCELLED: "Cancelado",
  REFUNDED: "Reembolsado",
};

export function Badge({ status, className }: { status: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold",
        statusStyles[status] || "bg-gray-100 text-gray-600",
        className
      )}
    >
      {labels[status] || status}
    </span>
  );
}

export function OrderStatusIcon({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "w-3 h-3 rounded-full inline-block",
        status === "DELIVERED" && "bg-mint-400",
        status === "SHIPPED" && "bg-rose-400",
        status === "IN_PRODUCTION" && "bg-lilac-400",
        (status === "CONFIRMED" || status === "ARTWORK_APPROVED") && "bg-serenity-400",
        (status === "AWAITING_ARTWORK" || status === "ARTWORK_UNDER_REVIEW") && "bg-yellow-400",
        status === "PENDING_PAYMENT" && "bg-gray-300",
        (status === "CANCELLED" || status === "REFUNDED") && "bg-red-300"
      )}
    />
  );
}
