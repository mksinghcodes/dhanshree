import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  @IsString({ message: 'refreshToken must be a string' })
  @IsNotEmpty({ message: 'refreshToken cannot be empty' })
  @MaxLength(2048, { message: 'refreshToken must not exceed 2048 characters' })
  refreshToken: string;
}
