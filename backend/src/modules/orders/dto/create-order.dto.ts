import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
  Min,
} from "class-validator";
import { Type } from "class-transformer";

class OrderItemDto {
  @IsString()
  productId: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsString()
  artworkUrl?: string;

  @IsOptional()
  customizations?: Record<string, any>;
}

export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsOptional()
  @IsString()
  shippingAddressId?: string;

  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @IsOptional()
  @IsString()
  clientWhatsapp?: string;
}
