import { Module } from "@nestjs/common";

import { StoresController } from "./stores.controller";
import { StoresService } from "./stores.service";
import { StoresRepository } from "./stores.repository";

import { DbModule } from "../db/db.module";

@Module({
  imports: [DbModule],
  controllers: [StoresController],
  providers: [StoresService, StoresRepository],
})
export class StoresModule {}
