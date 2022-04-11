import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  Req,
} from '@nestjs/common';
import { RecordsService } from './records.service';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Records Controller')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@Controller({ version: '1' })
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  @Post('profiles/:id/records')
  create(
    @Param('id') profileId: string,
    @Req() req,
    @Body() createRecordDto: CreateRecordDto,
  ) {
    return this.recordsService.create(+profileId, req.user.id, createRecordDto);
  }

  @Get('profiles/:id/records')
  findAll(@Param('id') profileId: string, @Req() req) {
    return this.recordsService.findAll(+profileId, req.user.id);
  }

  @Get('profiles/:id/record-reports')
  getReport(@Param('id') profileId: string, @Req() req) {
    return this.recordsService.getReport(+profileId, req.user.id);
  }

  @Get('records/:id')
  findOne(@Param('id') id: string) {
    return this.recordsService.findOne(+id);
  }

  @Delete('records/:id')
  remove(@Param('id') id: string) {
    return this.recordsService.remove(+id);
  }
}
