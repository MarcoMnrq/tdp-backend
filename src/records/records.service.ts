import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileEvents } from 'src/profiles/enums/profile-events.enum';
import { ProfilesService } from 'src/profiles/profiles.service';
import { Repository } from 'typeorm';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { Record } from './entities/record.entity';

@Injectable()
export class RecordsService {
  constructor(
    @InjectRepository(Record)
    private readonly recordsRepository: Repository<Record>,
    private readonly profilesRepository: ProfilesService,
  ) {}
  async create(
    profileId: number,
    userId: number,
    createRecordDto: CreateRecordDto,
  ) {
    const profile = await this.profilesRepository.findOneAndVerify(
      profileId,
      userId,
    );
    const record = this.recordsRepository.create({
      ...createRecordDto,
      profile,
    });
    if (record.success) {
      await this.profilesRepository.checkAchievements(
        profile.id,
        ProfileEvents.VICTORY,
      );
    } else {
      await this.profilesRepository.checkAchievements(
        profile.id,
        ProfileEvents.DEFEAT,
      );
    }
    return this.recordsRepository.save(record);
  }

  async findAll(profileId: number, userId: number) {
    const profile = await this.profilesRepository.findOneAndVerify(
      profileId,
      userId,
    );
    return this.recordsRepository.find({
      where: { profile },
    });
  }

  async getReport(profileId: number, userId: number) {
    const profile = await this.profilesRepository.findOneAndVerify(
      profileId,
      userId,
    );
    const records = await this.recordsRepository.find({
      where: { profile },
    });
    const report = records.reduce(
      (acc, record) => {
        if (record.success) {
          acc.success++;
        } else {
          acc.fail++;
        }
        return acc;
      },
      { success: 0, fail: 0 },
    );
    return {
      gamesWon: report.success,
      gamesLost: report.fail,
      gamesPlayed: report.success + report.fail,
      winLoseRatio: report.success / report.fail,
      averageTime:
        records.reduce((acc, record) => acc + record.time, 0) / records.length,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} record`;
  }

  remove(id: number) {
    return `This action removes a #${id} record`;
  }
}
