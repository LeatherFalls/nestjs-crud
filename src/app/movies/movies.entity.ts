import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'movies' })
export class MovieEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  /* @ManyToOne(() => Categories, (categories) => categories.movies)
  @JoinColumn({ name: 'category_id' }) */
  @Column({ nullable: false })
  category: string;

  @Column({ nullable: false })
  duration: string;

  @Column({ nullable: false })
  director: string;

  @Column({ nullable: false, name: 'age_group' })
  ageGroup: number;
}
