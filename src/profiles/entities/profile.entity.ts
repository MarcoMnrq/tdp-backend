import { Record } from 'src/records/entities/record.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  dob: Date;

  @ManyToOne(() => User, (user) => user.profiles)
  user: User;

  @OneToMany(() => Record, (record) => record.profile)
  records: Record[];
}
