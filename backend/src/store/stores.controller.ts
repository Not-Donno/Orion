import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";

import { StoresService } from "./stores.service";
import { CreateStoreDto } from "./dto/create-store.dto";

import { JwtAuthGuard } from "../auth/guard/jwt-auth.guard";

@Controller("stores")
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req: any, @Body() dto: CreateStoreDto) {
    return this.storesService.createStore(req.user, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get("mine")
  getMine(@Req() req: any) {
    return this.storesService.getMyStores(req.user.userId);
  }
}
