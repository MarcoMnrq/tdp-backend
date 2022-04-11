import { Module } from '@nestjs/common';
import { RecordsService } from './records.service';
import { RecordsController } from './records.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Record } from './entities/record.entity';
import { ProfilesService } from 'src/profiles/profiles.service';
import { ProfilesModule } from 'src/profiles/profiles.module';

@Module({
  imports: [TypeOrmModule.forFeature([Record]), ProfilesModule],
  controllers: [RecordsController],
  providers: [RecordsService],
})
export class RecordsModule {}
