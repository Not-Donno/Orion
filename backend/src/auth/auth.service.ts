import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { AuthRepository } from "./auth.repository";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private authRepo: AuthRepository,
  ) {}

  async register(dto: RegisterDto) {
    const { name, email, password, role } = dto;

    const existing = await this.authRepo.findByEmail(email);
    if (existing) throw new ConflictException("User already exists");

    const hashed = await bcrypt.hash(password, 10);
    const userId = await this.authRepo.createUser(
      name,
      email,
      hashed,
      role ?? "CUSTOMER",
    );
    const user = await this.authRepo.findById(userId);

    return {
      user,
      token: this.signToken(user),
    };
  }

  async login(dto: LoginDto) {
    const { email, password } = dto;

    const user = await this.authRepo.findByEmail(email);
    if (!user) throw new UnauthorizedException("Invalid credentials");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException("Invalid credentials");

    // Return user without password (non-mutating)
    const { password: _pw, ...safeUser } = user;

    return {
      user: safeUser,
      token: this.signToken(safeUser),
    };
  }

  async me(userId: number) {
    return this.authRepo.findById(userId);
  }

  private signToken(user: { id: number; email: string; role: string }) {
    return this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
  }
}
