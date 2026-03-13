import { Body, Controller, Post } from '@nestjs/common';
import { FoundPetsService } from './found-pets.service';
import { CreateFoundPetDto } from 'src/core/models/create-found-pet.dto';

@Controller('found-pets')
export class FoundPetsController {
  constructor(private readonly foundPetsService: FoundPetsService) {}

  @Post()
  async create(@Body() dto: CreateFoundPetDto) {
    console.log('[FoundPetsController] Registering found pet...');
    const result = await this.foundPetsService.create(dto);
    console.log('[FoundPetsController] Found pet registered:', result.id);
    return result;
  }
}
