import { Body, Controller, Get, Post } from '@nestjs/common';
import { FoundPetsService } from './found-pets.service';
import { CreateFoundPetDto } from 'src/core/models/create-found-pet.dto';
import { logger } from 'src/config/logger';

@Controller('found-pets')
export class FoundPetsController {
  constructor(private readonly foundPetsService: FoundPetsService) {}

  @Get()
  async findAll() {
    logger.info('[FoundPetsController] Received request to fetch all found pets.');
    const result = await this.foundPetsService.findAll();
    logger.info(`[FoundPetsController] Returning ${result.length} found pets.`);
    return result;
  }

  @Post()
  async create(@Body() dto: CreateFoundPetDto) {
    logger.info('[FoundPetsController] Received request to register found pet.');
    const result = await this.foundPetsService.create(dto);
    logger.info(`[FoundPetsController] Found pet registered: ${result.id}`);
    return result;
  }
}
