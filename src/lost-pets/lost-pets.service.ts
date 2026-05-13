import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LostPet } from 'src/core/entities/lost-pet.entity';
import { CreateLostPetDto } from 'src/core/models/create-lost-pet.dto';
import { CacheService } from 'src/cache/cache.service';

const CACHE_KEY_ACTIVE_LOST_PETS = 'lost-pets:active';

@Injectable()
export class LostPetsService {
  constructor(
    @InjectRepository(LostPet)
    private readonly lostPetRepository: Repository<LostPet>,
    private readonly cacheService: CacheService,
  ) {}

  async create(dto: CreateLostPetDto): Promise<LostPet> {
    const newPet = this.lostPetRepository.create({
      name: dto.name,
      species: dto.species,
      breed: dto.breed,
      color: dto.color,
      size: dto.size,
      description: dto.description,
      photo_url: dto.photo_url,
      owner_name: dto.owner_name,
      owner_email: dto.owner_email,
      owner_phone: dto.owner_phone,
      location: {
        type: 'Point',
        coordinates: [dto.lon, dto.lat],
      },
      address: dto.address,
      lost_date: dto.lost_date,
    });
    const saved = await this.lostPetRepository.save(newPet);
    await this.cacheService.delete(CACHE_KEY_ACTIVE_LOST_PETS);
    return saved;
  }

  async findAllActive(): Promise<LostPet[]> {
    try {
      const cached = await this.cacheService.get<LostPet[]>(CACHE_KEY_ACTIVE_LOST_PETS);
      if (cached && cached.length > 0) {
        return cached;
      }
      const result = await this.lostPetRepository.find({
        where: { is_active: true },
      });
      await this.cacheService.set(CACHE_KEY_ACTIVE_LOST_PETS, result);
      return result;
    } catch (error) {
      console.error('[LostPetsService] Error fetching active lost pets:', error);
      return [];
    }
  }

  async findNearby(lat: number, lon: number, radiusInMeters: number = 500): Promise<LostPet[]> {
    try {
      const result = await this.lostPetRepository
        .createQueryBuilder('lp')
        .addSelect(
          `ST_Distance(lp.location::geography, ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography)`,
          'distance',
        )
        .where('lp.is_active = true')
        .andWhere(
          `ST_DWithin(
            lp.location::geography,
            ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography,
            :radiusInMeters
          )`,
          { lat, lon, radiusInMeters },
        )
        .orderBy('distance', 'ASC')
        .getMany();
      return result;
    } catch (error) {
      console.error('[LostPetsService] Error finding nearby lost pets:', error);
      return [];
    }
  }
}
