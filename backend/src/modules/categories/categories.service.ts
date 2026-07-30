import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.category.findMany({
      where: { isActive: true },
      include: { children: true, _count: { select: { products: true } } },
      orderBy: { name: "asc" },
    });
  }

  async findAllAdmin() {
    return this.prisma.category.findMany({
      include: {
        parent: { select: { id: true, name: true } },
        children: true,
        _count: { select: { products: true } },
      },
      orderBy: { name: "asc" },
    });
  }

  async findOne(idOrSlug: string) {
    const where = idOrSlug.includes("-")
      ? { slug: idOrSlug }
      : { id: idOrSlug };

    const category = await this.prisma.category.findUnique({
      where,
      include: { parent: true, children: true },
    });
    if (!category) throw new NotFoundException("Categoria não encontrada");
    return category;
  }

  async create(dto: CreateCategoryDto) {
    const slug = dto.slug || dto.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");

    const exists = await this.prisma.category.findUnique({
      where: { slug },
    });
    if (exists) throw new ConflictException("Slug já existe");

    return this.prisma.category.create({ data: { ...dto, slug } });
  }

  async update(id: string, dto: UpdateCategoryDto) {
    await this.findOne(id);

    if (dto.slug) {
      const slugExists = await this.prisma.category.findUnique({
        where: { slug: dto.slug },
      });
      if (slugExists && slugExists.id !== id)
        throw new ConflictException("Slug já existe");
    }

    return this.prisma.category.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.category.delete({ where: { id } });
  }
}
