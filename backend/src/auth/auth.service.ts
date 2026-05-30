import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { AuthRepository } from "./auth.repository";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private authRepo: AuthRepository,
  ) {}

  async register(dto: any) {
    const { name, email, password, role } = dto;

    const existing = await this.authRepo.findByEmail(email);
    if (existing) throw new ConflictException("User already exists");

    const hashed = await bcrypt.hash(password, 10);

    const userId = await this.authRepo.createUser(
      name,
      email,
      hashed,
      role || "CUSTOMER",
    );

    const user = await this.authRepo.findById(userId);

    return {
      user,
      token: this.signToken(user),
    };
  }

  async login(dto: any) {
    const { email, password } = dto;

    const user = await this.authRepo.findByEmail(email);
    if (!user) throw new UnauthorizedException("Invalid credentials");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException("Invalid credentials");

    delete user.password;

    return {
      user,
      token: this.signToken(user),
    };
  }

  async me(userId: number) {
    return this.authRepo.findById(userId);
  }

  private signToken(user: any) {
    return this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
  }
}
