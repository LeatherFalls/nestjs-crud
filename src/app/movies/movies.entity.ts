import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'movies' })
export class MovieEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  category: string;

  @Column({ nullable: false })
  duration: string;

  @Column({ nullable: false })
  director: string;

  @Column({ nullable: false, name: 'age_group' })
  ageGroup: number;
}
