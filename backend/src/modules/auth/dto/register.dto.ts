import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from "class-validator";
import { UserRole } from "@prisma/client";

export class RegisterDto {
  @IsEmail({}, { message: "Email inválido" })
  email: string;

  @IsString()
  @MinLength(6, { message: "Senha deve ter no mínimo 6 caracteres" })
  password: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  cpfCnpj?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
