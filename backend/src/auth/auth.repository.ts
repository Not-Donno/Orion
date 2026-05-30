import { Inject, Injectable } from "@nestjs/common";
import type { Pool } from "mysql2/promise";

@Injectable()
export class AuthRepository {
  constructor(@Inject("DB_POOL") private db: Pool) {}

  async findByEmail(email: string) {
    const [rows]: any = await this.db.query(
      `SELECT * FROM users WHERE email = ?`,
      [email],
    );
    return rows[0];
  }

  async findById(id: number) {
    const [rows]: any = await this.db.query(
      `SELECT id, name, email, role, created_at FROM users WHERE id = ?`,
      [id],
    );
    return rows[0];
  }

  async createUser(
    name: string,
    email: string,
    password: string,
    role: string,
  ) {
    const [result]: any = await this.db.query(
      `INSERT INTO users (name, email, password, role)
       VALUES (?, ?, ?, ?)`,
      [name, email, password, role],
    );

    return result.insertId;
  }
}
