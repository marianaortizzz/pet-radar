import { Body, Controller, Get, Post } from '@nestjs/common';
import { LostPetsService } from './lost-pets.service';
import { CreateLostPetDto } from 'src/core/models/create-lost-pet.dto';
import { logger } from 'src/config/logger';

@Controller('lost-pets')
export class LostPetsController {
  constructor(private readonly lostPetsService: LostPetsService) {}

  @Get()
  async findAllActive() {
    logger.info('[LostPetsController] Received request to fetch active lost pets.');
    const result = await this.lostPetsService.findAllActive();
    logger.info(`[LostPetsController] Returning ${result.length} active lost pets.`);
    return result;
  }

  @Post()
  async create(@Body() dto: CreateLostPetDto) {
    logger.info('[LostPetsController] Received request to register lost pet.');
    const result = await this.lostPetsService.create(dto);
    logger.info(`[LostPetsController] Lost pet registered: ${result.id}`);
    return result;
  }
}
