import { DataSource, DataSourceOptions } from 'typeorm';
import { envs } from '../../config/envs';
import { LostPet } from '../entities/lost-pet.entity';
import { FoundPet } from '../entities/found-pet.entity';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: envs.DB_HOST,
  port: envs.DB_PORT,
  username: envs.DB_USER,
  password: envs.DB_PASSWORD,
  database: envs.DB_NAME,
  entities: [LostPet, FoundPet],
  synchronize: false,
  migrations: ['dist/core/db/migrations/*'],
};

export const dataSource = new DataSource(dataSourceOptions);
