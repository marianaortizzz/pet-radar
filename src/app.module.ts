import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from './email/email.module';
import { LostPetsModule } from './lost-pets/lost-pets.module';
import { FoundPetsModule } from './found-pets/found-pets.module';
import { dataSourceOptions } from './core/db/data-source';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    EmailModule,
    LostPetsModule,
    FoundPetsModule,
  ],
})
export class AppModule {}
