import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { Inject } from "@nestjs/common";
import type { Pool } from "mysql2/promise";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,

    @Inject("DB_POOL")
    private readonly db: Pool,
  ) {}

  // ---------------- REGISTER ----------------
  async register(dto: any) {
    const hashed = await bcrypt.hash(dto.password, 10);

    const [result]: any = await this.db.query(
      `INSERT INTO users (name, email, password, role)
       VALUES (?, ?, ?, ?)`,
      [dto.name, dto.email, hashed, dto.role || "CUSTOMER"],
    );

    const user = {
      id: result.insertId,
      name: dto.name,
      email: dto.email,
      role: dto.role || "CUSTOMER",
    };

    return {
      user,
      token: this.jwtService.sign({
        sub: user.id,
        email: user.email,
        role: user.role, // 🔥 MUST EXIST
      }),
    };
  }

  // ---------------- LOGIN ----------------
  async login(dto: any) {
    const [rows]: any = await this.db.query(
      `SELECT * FROM users WHERE email = ?`,
      [dto.email],
    );

    const user = rows[0];

    if (!user) throw new UnauthorizedException("Invalid credentials");

    const match = await bcrypt.compare(dto.password, user.password);

    if (!match) throw new UnauthorizedException("Invalid credentials");

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: this.jwtService.sign({
        sub: user.id,
        email: user.email,
        role: user.role, // 🔥 MUST EXIST
      }),
    };
  }

  // ---------------- ME ----------------
  async me(userId: number) {
    const [rows]: any = await this.db.query(
      `SELECT id, name, email, role, created_at
       FROM users
       WHERE id = ?`,
      [userId],
    );

    return rows[0] || null;
  }
}
