import { Module, ValidationPipe } from "@nestjs/common";
import { APP_FILTER, APP_GUARD, APP_PIPE } from "@nestjs/core";
import { ConfigModule } from "@nestjs/config";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import envConfig from "./config/env.config";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { CategoriesModule } from "./modules/categories/categories.module";
import { ProductsModule } from "./modules/products/products.module";
import { UploadModule } from "./modules/upload/upload.module";
import { OrdersModule } from "./modules/orders/orders.module";
import { DashboardModule } from "./modules/dashboard/dashboard.module";
import { JwtAuthGuard } from "./common/guards/jwt-auth.guard";
import { AllExceptionsFilter } from "./common/filters/http-exception.filter";
import { SeedService } from "./common/seed/seed.service";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [envConfig] }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "uploads"),
      serveRoot: "/uploads",
      serveStaticOptions: { index: false },
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    CategoriesModule,
    ProductsModule,
    UploadModule,
    OrdersModule,
    DashboardModule,
  ],
  providers: [
    SeedService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          whitelist: true,
          forbidNonWhitelisted: true,
          transform: true,
          transformOptions: { enableImplicitConversion: true },
        }),
    },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
  ],
})
export class AppModule {}
