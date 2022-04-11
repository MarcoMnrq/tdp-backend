import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Record {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  time: number;

  @Column()
  success: boolean;
}
