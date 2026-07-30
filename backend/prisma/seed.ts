import { PrismaClient, UserRole } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // ─── Admin padrão ───
  const adminPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@emilyatele.com.br" },
    update: {},
    create: {
      email: "admin@emilyatele.com.br",
      passwordHash: adminPassword,
      name: "Admin Emily",
      role: UserRole.ADMIN,
    },
  });

  // ─── Categorias ───
  const cats = [
    { name: "Papelaria Personalizada", slug: "papelaria-personalizada" },
    { name: "Convites", slug: "convites" },
    { name: "Arte Digital", slug: "arte-digital" },
    { name: "Kits Festa", slug: "kits-festa" },
  ];
  for (const cat of cats) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  // ─── Produtos ───
  const papelariaId = (await prisma.category.findUnique({ where: { slug: "papelaria-personalizada" } }))!.id;
  const convitesId = (await prisma.category.findUnique({ where: { slug: "convites" } }))!.id;

  await prisma.product.upsert({
    where: { sku: "CONV-001" },
    update: {},
    create: {
      name: "Convite Digital Personalizado",
      slug: "convite-digital-personalizado",
      sku: "CONV-001",
      description: "Arte digital para convite, entregue em PDF pronta para impressão.",
      shortDescription: "Arte digital para convite",
      priceInCents: 2990,
      stock: 999,
      isService: true,
      requiresAttachment: false,
      categories: { create: { categoryId: convitesId } },
    },
  });

  await prisma.product.upsert({
    where: { sku: "KIT-001" },
    update: {},
    create: {
      name: "Kit Festa 10 itens",
      slug: "kit-festa-10-itens",
      sku: "KIT-001",
      description: "Kit completo para festa com 10 itens personalizados.",
      shortDescription: "Kit festa 10 itens",
      priceInCents: 8990,
      comparePriceInCents: 11990,
      stock: 50,
      weightGrams: 500,
      lengthCm: 30,
      widthCm: 20,
      heightCm: 5,
      categories: { create: { categoryId: papelariaId } },
    },
  });

  console.log("✅ Seed concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
