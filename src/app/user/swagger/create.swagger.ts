import { OmitType } from '@nestjs/swagger';
import { UserEntity } from '../user.entity';

export class CreateUserSwagger extends OmitType(UserEntity, [
  'password',
  'passwordHash',
]) {}
