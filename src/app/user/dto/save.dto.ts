import { IsEmail, IsInt, IsNotEmpty, Length, Max, Min } from 'class-validator';

export class Save {
  @IsNotEmpty({
    message: 'username is required',
  })
  @Length(3, 40, {
    message: 'username length must be beetwen 3 and 40 characters long',
  })
  username: string;

  @IsNotEmpty({
    message: 'email is required',
  })
  @IsEmail({
    message: 'email must be valid',
  })
  email: string;

  @IsNotEmpty({
    message: 'password is required',
  })
  @Length(5, 30, {
    message: 'password length must be beetwen 5 and 30 characters long',
  })
  password: string;

  @IsNotEmpty()
  @IsInt()
  @Min(10)
  @Max(110)
  age: number;
}
