import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { hashSync } from 'bcrypt';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @ApiProperty()
  @Column({ nullable: false })
  username: string;

  @ApiProperty()
  @Column({ nullable: false })
  email: string;

  @ApiProperty()
  @Column({ nullable: false })
  password: string;

  @ApiProperty()
  @Column({ nullable: false })
  age: number;

  @ApiProperty()
  @BeforeInsert()
  passwordHash() {
    this.password = hashSync(this.password, 8);
  }
}
