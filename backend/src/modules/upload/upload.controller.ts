import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  BadRequestException,
  Req,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { UploadService } from "./upload.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";

@Controller("upload")
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(private upload: UploadService) {}

  @Post("artwork")
  @UseInterceptors(FileInterceptor("file"))
  async uploadArtwork(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
    if (!file) throw new BadRequestException("Nenhum arquivo enviado");
    return this.upload.saveFile(file, "artworks", req.get("host"), req.protocol);
  }

  @Post("image")
  @UseInterceptors(FileInterceptor("file"))
  async uploadImage(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
    if (!file) throw new BadRequestException("Nenhum arquivo enviado");
    return this.upload.saveFile(file, "images", req.get("host"), req.protocol);
  }
}
