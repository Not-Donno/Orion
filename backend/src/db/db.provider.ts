import { createPool } from "mysql2/promise";

export const dbProvider = {
  provide: "DB_POOL",
  useFactory: () => {
    return createPool({
      host: process.env.DB_HOST ?? "localhost",
      user: process.env.DB_USER ?? "orion_user",
      password: process.env.DB_PW,
      database: process.env.DB_NAME ?? "orion",
      port: Number(process.env.DB_PORT) || 3306,
      waitForConnections: true,
      connectionLimit: 10,
    });
  },
};
