import { ApiProperty } from '@nestjs/swagger';

export class LoginSwagger {
  @ApiProperty()
  token: string;
}
