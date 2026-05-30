import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsIn,
} from "class-validator";

export class RegisterDto {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsOptional()
  @IsIn(["CUSTOMER", "ADMIN"])
  role?: string;
}
