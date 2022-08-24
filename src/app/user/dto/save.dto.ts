import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  Length,
  Matches,
  Max,
  Min,
} from 'class-validator';
import { RegExHelper } from '../helper/regex.helper';

export class Save {
  @ApiProperty()
  @IsNotEmpty({
    message: 'username is required',
  })
  @Length(3, 40, {
    message: 'username length must be beetwen 3 and 40 characters long',
  })
  username: string;

  @ApiProperty()
  @IsNotEmpty({
    message: 'email is required',
  })
  @IsEmail({
    message: 'email must be valid',
  })
  email: string;

  @ApiProperty()
  @IsNotEmpty({
    message: 'password is required',
  })
  @Length(5, 30, {
    message: 'password length must be beetwen 5 and 30 characters long',
  })
  @Matches(RegExHelper.password, {
    message: 'incorrect password format',
  })
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  @Min(10)
  @Max(110)
  age: number;
}
