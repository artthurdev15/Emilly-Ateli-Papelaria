import { Injectable, Logger } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { UserRole } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(private prisma: PrismaService) {}

  async ensureAdmin() {
    const email = process.env.ADMIN_EMAIL || "emilly@admin.com";
    const password = process.env.ADMIN_PASSWORD || "emillybia150407";
    const name = process.env.ADMIN_NAME || "Emilly Admin";

    const exists = await this.prisma.user.findUnique({ where: { email } });
    if (exists) {
      this.logger.log(`Usuário administrador já existe (${email})`);
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        role: UserRole.ADMIN,
      },
    });
    this.logger.log(`Usuário administrador criado (${email})`);
  }
}
