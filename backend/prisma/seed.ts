import { PrismaClient, UserRole } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // ─── Admin padrão ───
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME || "Emilly Admin";

  if (adminEmail && adminPassword) {
    const adminPasswordHash = await bcrypt.hash(adminPassword, 10);
    await prisma.user.upsert({
      where: { email: adminEmail },
      update: {},
      create: {
        email: adminEmail,
        passwordHash: adminPasswordHash,
        name: adminName,
        role: UserRole.ADMIN,
      },
    });
    console.log(`👤 Usuário administrador garantido (${adminEmail})`);
  } else {
    console.warn("⚠️ ADMIN_EMAIL/ADMIN_PASSWORD não definidos — pulando criação do admin.");
  }

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
