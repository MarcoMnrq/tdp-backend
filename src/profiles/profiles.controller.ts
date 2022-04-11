import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Profiles Controller')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@Controller({ path: 'profiles', version: '1' })
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  create(@Req() req, @Body() createProfileDto: CreateProfileDto) {
    return this.profilesService.create(req.user, createProfileDto);
  }

  @Get()
  findAll(@Req() req) {
    return this.profilesService.findAll(req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profilesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Req() req,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.profilesService.update(+id, req.user, updateProfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.profilesService.remove(+id, req.user.id);
  }
}
