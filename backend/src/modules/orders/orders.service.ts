import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { OrderStatus } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderStatusDto } from "./dto/update-order-status.dto";

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateOrderDto) {
    const products = await this.prisma.product.findMany({
      where: { id: { in: dto.items.map((i) => i.productId) }, isActive: true },
    });

    if (products.length !== dto.items.length) {
      throw new BadRequestException("Um ou mais produtos não encontrados");
    }

    const itemsData = dto.items.map((item) => {
      const product = products.find((p) => p.id === item.productId)!;

      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Estoque insuficiente para "${product.name}". Disponível: ${product.stock}`
        );
      }

      const total = product.priceInCents * item.quantity;

      return {
        productId: product.id,
        productName: product.name,
        productSku: product.sku,
        quantity: item.quantity,
        unitPriceInCents: product.priceInCents,
        totalInCents: total,
        artworkUrl: item.artworkUrl,
        customizations: item.customizations ?? undefined,
      };
    });

    const totalInCents = itemsData.reduce((sum, i) => sum + i.totalInCents, 0);

    const lastOrder = await this.prisma.order.findFirst({
      orderBy: { createdAt: "desc" },
      select: { orderNumber: true },
    });

    const lastNum = lastOrder
      ? parseInt(lastOrder.orderNumber.replace("EMP-", ""), 10)
      : 0;
    const orderNumber = `EMP-${String(lastNum + 1).padStart(5, "0")}`;

    const hasServiceItems = products.some((p) => p.isService);
    const needsArtwork = products.some((p) => p.requiresAttachment);

    let initialStatus: any = "PENDING_PAYMENT";
    if (needsArtwork) initialStatus = "AWAITING_ARTWORK";

    const order = await this.prisma.order.create({
      data: {
        orderNumber,
        userId,
        status: initialStatus,
        shippingAddressId: dto.shippingAddressId,
        totalInCents,
        paymentMethod: dto.paymentMethod,
        clientWhatsapp: dto.clientWhatsapp,
        items: { create: itemsData },
        history: {
          create: {
            status: initialStatus,
            note: "Pedido criado",
            changedBy: userId,
          },
        },
      },
      include: {
        items: true,
        history: true,
        address: true,
      },
    });

    for (const item of itemsData) {
      await this.prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return order;
  }

  async findKanban() {
    const orders = await this.prisma.order.findMany({
      where: {
        status: { notIn: ["CANCELLED", "REFUNDED", "DELIVERED"] },
      },
      orderBy: { updatedAt: "desc" },
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: true,
      },
    });

    return orders;
  }

  async findByUser(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.order.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          items: true,
          history: { orderBy: { createdAt: "desc" } },
          address: true,
        },
      }),
      this.prisma.order.count({ where: { userId } }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findAllAdmin(query: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;
    const where: any = {};

    if (query.status) where.status = query.status;
    if (query.search) {
      where.OR = [
        { orderNumber: { contains: query.search, mode: "insensitive" } },
        { user: { name: { contains: query.search, mode: "insensitive" } } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { id: true, name: true, email: true } },
          items: true,
          history: { orderBy: { createdAt: "desc" }, take: 5 },
          address: true,
        },
      }),
      this.prisma.order.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        items: true,
        history: { orderBy: { createdAt: "desc" } },
        address: true,
      },
    });
    if (!order) throw new NotFoundException("Pedido não encontrado");
    return order;
  }

  async updateStatus(
    id: string,
    dto: UpdateOrderStatusDto,
    changedBy: string
  ) {
    const order = await this.findOne(id);

    const updateData: any = { status: dto.status };
    if (dto.trackingCode) updateData.trackingCode = dto.trackingCode;
    if (dto.trackingUrl) updateData.trackingUrl = dto.trackingUrl;
    if (dto.estimatedDays) updateData.estimatedDays = dto.estimatedDays;
    if (dto.status === "DELIVERED") updateData.deliveredAt = new Date();

    await this.prisma.orderHistory.create({
      data: {
        orderId: id,
        status: dto.status,
        note: dto.note || `Status alterado para ${dto.status}`,
        changedBy,
      },
    });

    return this.prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        items: true,
        history: { orderBy: { createdAt: "desc" } },
        address: true,
      },
    });
  }

  async approveArtwork(
    orderItemId: string,
    approved: boolean,
    notes?: string
  ) {
    const item = await this.prisma.orderItem.findUnique({
      where: { id: orderItemId },
      include: { order: true },
    });
    if (!item) throw new NotFoundException("Item do pedido não encontrado");

    await this.prisma.orderItem.update({
      where: { id: orderItemId },
      data: { artworkApproved: approved, artworkNotes: notes },
    });

    const allItems = await this.prisma.orderItem.findMany({
      where: { orderId: item.orderId },
    });

    const allReviewed = allItems.every((i) => i.artworkApproved !== null);
    const allApproved = allItems.every((i) => i.artworkApproved === true);

    if (allReviewed && allApproved) {
      await this.updateStatus(
        item.orderId,
        { status: "ARTWORK_APPROVED", note: "Todas as artes aprovadas" },
        "system"
      );
    }

    return this.prisma.orderItem.findUnique({
      where: { id: orderItemId },
    });
  }
}
