import { Injectable, BadRequestException } from "@nestjs/common";
import { existsSync, mkdirSync } from "fs";
import { writeFile } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";

@Injectable()
export class UploadService {
  private uploadDir: string;

  constructor() {
    this.uploadDir = process.env.UPLOAD_DIR || "./uploads";
    if (!existsSync(this.uploadDir)) {
      mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async saveFile(
    file: Express.Multer.File,
    subfolder = "artworks"
  ): Promise<{ url: string; fileName: string }> {
    this.validateFile(file);

    const targetDir = join(this.uploadDir, subfolder);
    if (!existsSync(targetDir)) {
      mkdirSync(targetDir, { recursive: true });
    }

    const ext = this.getExtension(file.originalname);
    const fileName = `${randomUUID()}${ext}`;
    const filePath = join(targetDir, fileName);

    await writeFile(filePath, file.buffer);

    const url = `/uploads/${subfolder}/${fileName}`;
    return { url, fileName };
  }

  private validateFile(file: Express.Multer.File) {
    const allowedMimes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "application/pdf",
      "image/svg+xml",
      "image/webp",
    ];

    if (!allowedMimes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Formato não permitido: ${file.mimetype}. Aceitos: PNG, JPG, PDF, SVG, WebP`
      );
    }

    const maxSize = parseInt(process.env.MAX_FILE_SIZE || "10485760", 10);
    if (file.size > maxSize) {
      throw new BadRequestException(
        `Arquivo muito grande. Máximo: ${maxSize / 1024 / 1024}MB`
      );
    }
  }

  private getExtension(filename: string): string {
    const ext = filename.split(".").pop();
    return ext ? `.${ext}` : ".png";
  }
}
