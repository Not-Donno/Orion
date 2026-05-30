import { createPool } from "mysql2/promise";

export const dbProvider = {
  provide: "DB_POOL",
  useFactory: () => {
    return createPool({
      host: "localhost",
      user: "orion_user",
      password: process.env.DB_PW,
      database: "orion",
      port: 3306,
      waitForConnections: true,
      connectionLimit: 10,
    });
  },
};
