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
  create(@Body() createRecordDto: CreateRecordDto) {
    return this.recordsService.create(createRecordDto);
  }

  @Get('profiles/:id/records')
  findAll() {
    return this.recordsService.findAll();
  }

  @Get('records/:id')
  findOne(@Param('id') id: string) {
    return this.recordsService.findOne(+id);
  }

  @Patch('records/:id')
  update(@Param('id') id: string, @Body() updateRecordDto: UpdateRecordDto) {
    return this.recordsService.update(+id, updateRecordDto);
  }

  @Delete('records/:id')
  remove(@Param('id') id: string) {
    return this.recordsService.remove(+id);
  }
}
