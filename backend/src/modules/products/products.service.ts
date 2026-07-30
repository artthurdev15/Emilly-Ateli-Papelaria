import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAllPublic(query: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    featured?: boolean;
    isService?: boolean;
    minPrice?: number;
    maxPrice?: number;
    sort?: "price_asc" | "price_desc" | "name_asc" | "newest";
  }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = { isActive: true };

    if (query.category) {
      where.categories = {
        some: { category: { slug: query.category } },
      };
    }

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: "insensitive" } },
        { description: { contains: query.search, mode: "insensitive" } },
      ];
    }

    if (query.featured) where.featured = true;
    if (query.isService !== undefined) where.isService = query.isService;

    if (query.minPrice || query.maxPrice) {
      where.priceInCents = {};
      if (query.minPrice) where.priceInCents.gte = query.minPrice;
      if (query.maxPrice) where.priceInCents.lte = query.maxPrice;
    }

    let orderBy: any = { createdAt: "desc" };
    if (query.sort === "price_asc") orderBy = { priceInCents: "asc" };
    else if (query.sort === "price_desc") orderBy = { priceInCents: "desc" };
    else if (query.sort === "name_asc") orderBy = { name: "asc" };

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          images: { orderBy: { order: "asc" } },
          categories: {
            include: { category: { select: { id: true, name: true, slug: true } } },
          },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findAllAdmin(query: {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
  }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: "insensitive" } },
        { sku: { contains: query.search, mode: "insensitive" } },
      ];
    }

    if (query.isActive !== undefined) where.isActive = query.isActive;

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          images: { orderBy: { order: "asc" } },
          categories: {
            include: { category: { select: { id: true, name: true, slug: true } } },
          },
          _count: { select: { orderItems: true } },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(idOrSlug: string) {
    const where = idOrSlug.includes("-")
      ? { slug: idOrSlug }
      : { id: idOrSlug };

    const product = await this.prisma.product.findUnique({
      where,
      include: {
        images: { orderBy: { order: "asc" } },
        categories: {
          include: { category: { select: { id: true, name: true, slug: true } } },
        },
      },
    });
    if (!product) throw new NotFoundException("Produto não encontrado");
    return product;
  }

  async create(dto: CreateProductDto) {
    const existingSlug = await this.prisma.product.findUnique({
      where: { slug: dto.slug },
    });
    if (existingSlug) throw new ConflictException("Slug já existe");

    const existingSku = await this.prisma.product.findUnique({
      where: { sku: dto.sku },
    });
    if (existingSku) throw new ConflictException("SKU já existe");

    const { categoryIds, ...data } = dto;

    return this.prisma.product.create({
      data: {
        ...data,
        categories: categoryIds?.length
          ? { create: categoryIds.map((id) => ({ categoryId: id })) }
          : undefined,
      },
      include: {
        images: true,
        categories: { include: { category: true } },
      },
    });
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.findOne(id);

    if (dto.slug) {
      const slugExists = await this.prisma.product.findUnique({
        where: { slug: dto.slug },
      });
      if (slugExists && slugExists.id !== id)
        throw new ConflictException("Slug já existe");
    }

    if (dto.sku) {
      const skuExists = await this.prisma.product.findUnique({
        where: { sku: dto.sku },
      });
      if (skuExists && skuExists.id !== id)
        throw new ConflictException("SKU já existe");
    }

    const { categoryIds, ...data } = dto;

    if (categoryIds) {
      await this.prisma.productCategory.deleteMany({
        where: { productId: id },
      });
      await this.prisma.productCategory.createMany({
        data: categoryIds.map((categoryId) => ({ productId: id, categoryId })),
      });
    }

    return this.prisma.product.update({
      where: { id },
      data,
      include: {
        images: true,
        categories: { include: { category: true } },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.product.delete({ where: { id } });
  }

  async updateStock(id: string, quantity: number) {
    return this.prisma.product.update({
      where: { id },
      data: { stock: { decrement: quantity } },
    });
  }
}
