import {
  IsString,
  IsInt,
  IsBoolean,
  IsOptional,
  IsArray,
  Min,
  IsJSON,
} from "class-validator";

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsString()
  sku: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  shortDescription?: string;

  @IsInt()
  @Min(1)
  priceInCents: number;

  @IsOptional()
  @IsInt()
  comparePriceInCents?: number;

  @IsOptional()
  @IsInt()
  costInCents?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsBoolean()
  isService?: boolean;

  @IsOptional()
  @IsBoolean()
  requiresAttachment?: boolean;

  @IsOptional()
  @IsString()
  attachmentInstructions?: string;

  @IsOptional()
  @IsInt()
  weightGrams?: number;

  @IsOptional()
  @IsInt()
  lengthCm?: number;

  @IsOptional()
  @IsInt()
  widthCm?: number;

  @IsOptional()
  @IsInt()
  heightCm?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categoryIds?: string[];

  @IsOptional()
  @IsJSON()
  metadata?: any;
}
