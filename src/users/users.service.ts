import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthProvider } from 'src/auth/auth-provider.enum';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create({
      ...createUserDto,
      verified: false,
      provider: AuthProvider.EMAIL,
    });
    return this.userRepository.save(user);
  }
  async register(payload: any) {
    const user = this.userRepository.create({
      ...payload,
      verified: false,
      provider: AuthProvider.EMAIL,
    });
    return await this.userRepository.save(user);
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne(id, {
      relations: ['profiles'],
    });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    return `This action updates a #${id} user`;
  }

  updateUser(user: User) {
    return this.userRepository.save(user);
  }

  async updateRole(id: number, updateRoleDto: UpdateRoleDto) {
    const user = await this.findOne(id);
    if (updateRoleDto.role && updateRoleDto.password) {
      user.role = updateRoleDto.role;
      const newHashedPassword = await bcrypt.hash(updateRoleDto.password, 10);
      user.password = newHashedPassword;
    } else if (updateRoleDto.role) {
      user.role = updateRoleDto.role;
    } else if (updateRoleDto.password) {
      const newHashedPassword = await bcrypt.hash(updateRoleDto.password, 10);
      user.password = newHashedPassword;
    } else {
      throw new BadRequestException(
        'You must provide either a role or a password',
      );
    }
    return this.userRepository.save(user);
  }

  async updatePassword(id: number, newHashedPassword: string) {
    const user = await this.findOne(id);
    user.password = newHashedPassword;
    return this.userRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    const deleteResponse = await this.userRepository.softDelete(user.id);
    if (!deleteResponse.affected) {
      throw new BadRequestException(`User with id ${id} could not be deleted`);
    }
    return deleteResponse;
  }
}
