import { OmitType } from '@nestjs/swagger';
import { UserEntity } from '../user.entity';

export class FindUserSwagger extends OmitType(UserEntity, [
  'password',
  'passwordHash',
]) {}
