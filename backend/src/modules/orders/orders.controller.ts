import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from "@nestjs/common";
import { UserRole, OrderStatus } from "@prisma/client";
import { OrdersService } from "./orders.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderStatusDto } from "./dto/update-order-status.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@Controller("orders")
export class OrdersController {
  constructor(private orders: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@CurrentUser("id") userId: string, @Body() dto: CreateOrderDto) {
    return this.orders.create(userId, dto);
  }

  @Get("my")
  @UseGuards(JwtAuthGuard)
  findMy(
    @CurrentUser("id") userId: string,
    @Query("page") page?: string,
    @Query("limit") limit?: string
  ) {
    return this.orders.findByUser(userId, Number(page) || 1, Number(limit) || 10);
  }

  @Get("admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findAllAdmin(
    @Query("page") page?: string,
    @Query("limit") limit?: string,
    @Query("status") status?: string,
    @Query("search") search?: string
  ) {
    return this.orders.findAllAdmin({
      page: Number(page) || 1,
      limit: Number(limit) || 20,
      status,
      search,
    });
  }

  @Get("kanban")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findKanban() {
    return this.orders.findKanban();
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  findOne(@Param("id") id: string) {
    return this.orders.findOne(id);
  }

  @Patch(":id/status")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  updateStatus(
    @Param("id") id: string,
    @Body() dto: UpdateOrderStatusDto,
    @CurrentUser("id") userId: string
  ) {
    return this.orders.updateStatus(id, dto, userId);
  }

  @Patch("items/:itemId/artwork")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  approveArtwork(
    @Param("itemId") itemId: string,
    @Body("approved") approved: boolean,
    @Body("notes") notes?: string
  ) {
    return this.orders.approveArtwork(itemId, approved, notes);
  }
}
