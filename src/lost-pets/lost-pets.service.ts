import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LostPet } from 'src/core/entities/lost-pet.entity';
import { CreateLostPetDto } from 'src/core/models/create-lost-pet.dto';

@Injectable()
export class LostPetsService {
  constructor(
    @InjectRepository(LostPet)
    private readonly lostPetRepository: Repository<LostPet>,
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
    return this.lostPetRepository.save(newPet);
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
