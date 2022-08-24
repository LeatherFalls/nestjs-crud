import { ApiProperty } from '@nestjs/swagger';

export class BadRequest {
  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  message: string[];

  @ApiProperty()
  error: string;
}
