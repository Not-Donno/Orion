import { Inject, Injectable } from "@nestjs/common";
import type { Pool } from "mysql2/promise";

@Injectable()
export class StoresRepository {
  constructor(
    @Inject("DB_POOL")
    private readonly db: Pool,
  ) {}

  async create(name: string, ownerId: number) {
    const [result]: any = await this.db.query(
      `
      INSERT INTO stores (name, owner_id)
      VALUES (?, ?)
      `,
      [name, ownerId],
    );

    return result.insertId;
  }

  async findById(id: number) {
    const [rows]: any = await this.db.query(
      `
      SELECT *
      FROM stores
      WHERE id = ?
      `,
      [id],
    );

    return rows[0];
  }

  async findByOwner(ownerId: number) {
    const [rows]: any = await this.db.query(
      `
      SELECT *
      FROM stores
      WHERE owner_id = ?
      `,
      [ownerId],
    );

    return rows;
  }
}
