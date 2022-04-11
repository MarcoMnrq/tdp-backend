import { Profile } from 'src/profiles/entities/profile.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Record {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  time: number;

  @Column()
  success: boolean;

  @Column()
  minigame: string;

  @ManyToOne(() => Profile, (profile) => profile.records)
  profile: Profile;
}
