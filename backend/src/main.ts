import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SeedService } from "./common/seed/seed.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  const seed = app.get(SeedService);
  await seed.ensureAdmin();

  app.setGlobalPrefix("api");

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 API rodando em http://localhost:${port}/api`);
}
bootstrap();
