import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FoundPet } from 'src/core/entities/found-pet.entity';
import { LostPet } from 'src/core/entities/lost-pet.entity';
import { CreateFoundPetDto } from 'src/core/models/create-found-pet.dto';
import { LostPetsService } from 'src/lost-pets/lost-pets.service';
import { EmailService } from 'src/email/email.service';
import { generateFoundPetEmailTemplate } from './templates/found-pet.template';
import { EmailOptions } from 'src/core/models/email-options.model';
import { CacheService } from 'src/cache/cache.service';

const CACHE_KEY_ALL_FOUND_PETS = 'found-pets:all';

@Injectable()
export class FoundPetsService {
  constructor(
    @InjectRepository(FoundPet)
    private readonly foundPetRepository: Repository<FoundPet>,
    private readonly lostPetsService: LostPetsService,
    private readonly emailService: EmailService,
    private readonly cacheService: CacheService,
  ) {}

  async create(dto: CreateFoundPetDto): Promise<FoundPet> {
    const newFoundPet = this.foundPetRepository.create({
      species: dto.species,
      breed: dto.breed,
      color: dto.color,
      size: dto.size,
      description: dto.description,
      photo_url: dto.photo_url,
      finder_name: dto.finder_name,
      finder_email: dto.finder_email,
      finder_phone: dto.finder_phone,
      location: {
        type: 'Point',
        coordinates: [dto.lon, dto.lat],
      },
      address: dto.address,
      found_date: dto.found_date,
    });

    const savedFoundPet = await this.foundPetRepository.save(newFoundPet);
    await this.cacheService.delete(CACHE_KEY_ALL_FOUND_PETS);

    console.log('[FoundPetsService] Searching for nearby lost pets within 500m...');
    const nearbyLostPets = await this.lostPetsService.findNearby(dto.lat, dto.lon, 500);
    console.log(`[FoundPetsService] Found ${nearbyLostPets.length} nearby lost pet(s).`);

    for (const lostPet of nearbyLostPets) {
      await this.notifyOwner(lostPet, savedFoundPet, dto);
    }

    return savedFoundPet;
  }

  async findAll(): Promise<FoundPet[]> {
    try {
      const cached = await this.cacheService.get<FoundPet[]>(CACHE_KEY_ALL_FOUND_PETS);
      if (cached && cached.length > 0) {
        return cached;
      }
      const result = await this.foundPetRepository.find();
      await this.cacheService.set(CACHE_KEY_ALL_FOUND_PETS, result);
      return result;
    } catch (error) {
      console.error('[FoundPetsService] Error fetching found pets:', error);
      return [];
    }
  }

  private async notifyOwner(
    lostPet: LostPet,
    foundPet: FoundPet,
    foundDto: CreateFoundPetDto,
  ): Promise<void> {
    const lostCoords = (lostPet.location as any).coordinates as [number, number];
    const htmlBody = generateFoundPetEmailTemplate({
      lostPet,
      foundPet,
      foundLat: foundDto.lat,
      foundLon: foundDto.lon,
      lostLon: lostCoords[0],
      lostLat: lostCoords[1],
    });

    const options: EmailOptions = {
      to: lostPet.owner_email,
      subject: `PetRadar: Posible avistamiento de ${lostPet.name}`,
      htmlBody,
    };

    const sent = await this.emailService.sendEmail(options);
    if (sent) {
      console.log(`[FoundPetsService] Email sent to ${lostPet.owner_email} for pet "${lostPet.name}"`);
    }
  }
}
