import { Injectable, ForbiddenException } from "@nestjs/common";
import { StoresRepository } from "./stores.repository";
import { CreateStoreDto } from "./dto/create-store.dto";

@Injectable()
export class StoresService {
  constructor(private readonly storesRepository: StoresRepository) {}

  async createStore(user: any, dto: CreateStoreDto) {
    if (user.role !== "OWNER") {
      throw new ForbiddenException("Only owners can create stores");
    }

    const storeId = await this.storesRepository.create(dto.name, user.userId);

    return this.storesRepository.findById(storeId);
  }

  async getMyStores(userId: number) {
    return this.storesRepository.findByOwner(userId);
  }
}
