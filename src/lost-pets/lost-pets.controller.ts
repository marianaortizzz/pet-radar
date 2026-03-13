import { Body, Controller, Post } from '@nestjs/common';
import { LostPetsService } from './lost-pets.service';
import { CreateLostPetDto } from 'src/core/models/create-lost-pet.dto';

@Controller('lost-pets')
export class LostPetsController {
  constructor(private readonly lostPetsService: LostPetsService) {}

  @Post()
  async create(@Body() dto: CreateLostPetDto) {
    console.log('[LostPetsController] Registering lost pet...');
    const result = await this.lostPetsService.create(dto);
    console.log('[LostPetsController] Lost pet registered:', result.id);
    return result;
  }
}
