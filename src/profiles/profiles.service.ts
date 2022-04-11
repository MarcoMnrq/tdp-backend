import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from './entities/profile.entity';
import { Achievements } from './enums/achievements.enum';
import { ProfileEvents } from './enums/profile-events.enum';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private readonly profilesRepository: Repository<Profile>,
    private readonly usersService: UsersService,
  ) {}
  async create(user: User, createProfileDto: CreateProfileDto) {
    const profile = this.profilesRepository.create({
      ...createProfileDto,
      user,
    });
    return this.profilesRepository.save(profile);
  }

  findAll(user: User) {
    return this.profilesRepository.find({
      where: { user },
    });
  }

  async findOne(id: number) {
    const profile = await this.profilesRepository.findOne(id, {
      relations: ['user'],
    });
    if (!profile) {
      throw new BadRequestException(`Profile with id ${id} not found`);
    }
    return profile;
  }
  async findOneAndVerify(id: number, userId: number) {
    const profile = await this.profilesRepository.findOne(id, {
      relations: ['user'],
    });
    const user = await this.usersService.findOne(userId);
    if (!profile) {
      throw new BadRequestException(`Profile with id ${id} not found`);
    }
    if (profile.user.id !== user.id) {
      throw new BadRequestException(
        'You are not allowed to access this profile',
      );
    }
    return profile;
  }

  async update(id: number, userId: number, updateProfileDto: UpdateProfileDto) {
    const user = await this.usersService.findOne(userId);
    const profile = await this.findOne(id);
    if (profile.user.id !== user.id) {
      throw new BadRequestException(
        'You are not allowed to update this profile',
      );
    }
    return this.profilesRepository.save({
      ...profile,
      ...updateProfileDto,
    });
  }

  async remove(id: number, userId: number) {
    const user = await this.usersService.findOne(userId);
    const profile = await this.findOne(id);
    if (profile.user.id !== user.id) {
      throw new BadRequestException(
        'You are not allowed to delete this profile',
      );
    }
    return this.profilesRepository.remove(profile);
  }

  async checkAchievements(profileId: number, event: ProfileEvents) {
    const profile = await this.findOne(profileId);
    const achievements = profile.achievements;
    if (event === ProfileEvents.VICTORY) {
      if (achievements.includes(Achievements.FIRST_WIN)) {
        return;
      }
      achievements.push(Achievements.FIRST_WIN);
    }
    if (event === ProfileEvents.DEFEAT) {
      if (achievements.includes(Achievements.FIRST_LOSS)) {
        return;
      }
      achievements.push(Achievements.FIRST_LOSS);
    }
    return this.profilesRepository.save({
      ...profile,
      achievements,
    });
  }
}
