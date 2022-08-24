import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'movies' })
export class MovieEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @ApiProperty()
  @Column({ nullable: false })
  name: string;

  @ApiProperty()
  @Column({ nullable: false })
  category: string;

  @ApiProperty()
  @Column({ nullable: false })
  duration: string;

  @ApiProperty()
  @Column({ nullable: false })
  director: string;

  @ApiProperty()
  @Column({ nullable: false, name: 'age_group' })
  ageGroup: number;
}
