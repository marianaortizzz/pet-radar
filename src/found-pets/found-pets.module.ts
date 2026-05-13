import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoundPetsController } from './found-pets.controller';
import { FoundPetsService } from './found-pets.service';
import { FoundPet } from 'src/core/entities/found-pet.entity';
import { LostPetsModule } from 'src/lost-pets/lost-pets.module';
import { EmailModule } from 'src/email/email.module';
import { CacheModule } from 'src/cache/cache.module';

@Module({
  imports: [TypeOrmModule.forFeature([FoundPet]), LostPetsModule, EmailModule, CacheModule],
  controllers: [FoundPetsController],
  providers: [FoundPetsService],
})
export class FoundPetsModule {}
