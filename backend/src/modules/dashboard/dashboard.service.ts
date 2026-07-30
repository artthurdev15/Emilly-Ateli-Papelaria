import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboard() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      totalProducts,
      newOrders,
      revenue,
      monthlyRevenue,
      pendingOrders,
      completedOrders,
      recentOrders,
      topProducts,
      monthlySeries,
    ] = await Promise.all([
      this.prisma.product.count({ where: { isActive: true } }),
      this.prisma.order.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      this.prisma.order.aggregate({
        _sum: { totalInCents: true },
        where: { status: { not: "CANCELLED" } },
      }),
      this.prisma.order.aggregate({
        _sum: { totalInCents: true },
        where: { status: "DELIVERED", deliveredAt: { gte: startOfMonth } },
      }),
      this.prisma.order.count({
        where: { status: { in: ["PENDING_PAYMENT", "AWAITING_ARTWORK", "ARTWORK_UNDER_REVIEW"] } },
      }),
      this.prisma.order.count({
        where: { status: "DELIVERED", deliveredAt: { gte: startOfMonth } },
      }),
      this.prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          orderNumber: true,
          totalInCents: true,
          status: true,
          createdAt: true,
          user: { select: { name: true } },
        },
      }),
      this.prisma.orderItem.groupBy({
        by: ["productId", "productName"],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 5,
      }),
      this.getMonthlySeries(),
    ]);

    return {
      totalProducts,
      newOrders,
      revenue: revenue._sum.totalInCents || 0,
      monthlyRevenue: monthlyRevenue._sum.totalInCents || 0,
      pendingOrders,
      completedOrders,
      recentOrders: recentOrders.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        totalInCents: o.totalInCents,
        status: o.status,
        createdAt: o.createdAt,
        customerName: o.user.name,
      })),
      topProducts: topProducts.map((p) => ({
        productName: p.productName,
        quantity: p._sum.quantity || 0,
      })),
      monthlySeries,
    };
  }

  private async getMonthlySeries() {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const orders = await this.prisma.order.findMany({
      where: {
        deliveredAt: { gte: sixMonthsAgo },
        status: "DELIVERED",
      },
      select: { deliveredAt: true, totalInCents: true },
    });

    const series: { month: string; revenue: number; orders: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = d.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });
      const monthOrders = orders.filter((o) => {
        if (!o.deliveredAt) return false;
        return (
          o.deliveredAt.getMonth() === d.getMonth() &&
          o.deliveredAt.getFullYear() === d.getFullYear()
        );
      });
      series.push({
        month: key,
        revenue: monthOrders.reduce((s, o) => s + o.totalInCents, 0),
        orders: monthOrders.length,
      });
    }

    return series;
  }
}
