import { Exclude, Expose } from 'class-transformer';
import { AuthProvider } from 'src/auth/auth-provider.enum';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from '../user-role.enum';
import { formatRelative } from 'date-fns';
import { es } from 'date-fns/locale';
import { Profile } from 'src/profiles/entities/profile.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.REGULAR,
  })
  role: UserRole;

  @Column({
    type: 'enum',
    enum: AuthProvider,
    default: AuthProvider.EMAIL,
  })
  provider: AuthProvider;

  @Column({ default: false })
  verified: boolean;

  @OneToMany(() => Profile, (profile) => profile.user)
  profiles: Profile[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Expose()
  get created(): string {
    return this.createdAt
      ? formatRelative(this.createdAt, new Date(), { locale: es })
      : '';
  }

  @Expose()
  get updated(): string {
    return this.updatedAt
      ? formatRelative(this.updatedAt, new Date(), { locale: es })
      : '';
  }
}
