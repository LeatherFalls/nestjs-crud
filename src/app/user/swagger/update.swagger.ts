import { OmitType } from '@nestjs/swagger';
import { UserEntity } from '../user.entity';

export class UpdateUserSwagger extends OmitType(UserEntity, [
  'password',
  'passwordHash',
]) {}
