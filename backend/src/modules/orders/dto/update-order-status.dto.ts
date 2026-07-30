import { IsEnum, IsOptional, IsString, IsInt } from "class-validator";
import { OrderStatus } from "@prisma/client";

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsString()
  trackingCode?: string;

  @IsOptional()
  @IsString()
  trackingUrl?: string;

  @IsOptional()
  @IsInt()
  estimatedDays?: number;
}
