import { Record } from 'src/records/entities/record.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Achievements } from '../enums/achievements.enum';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  dob: Date;

  @Column({ type: 'enum', enum: Achievements, array: true, default: [] })
  achievements: Achievements[];

  @ManyToOne(() => User, (user) => user.profiles)
  user: User;

  @OneToMany(() => Record, (record) => record.profile)
  records: Record[];
}
