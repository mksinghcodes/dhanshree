import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({ example: 'sample_refresh_token_string...' })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
