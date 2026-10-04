import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'buyer@example.com' })
  @IsEmail({}, { message: 'email must be a valid email address' })
  @MaxLength(255, { message: 'email must not exceed 255 characters' })
  email: string;

  @ApiProperty({ example: 'Password123!', minLength: 1, maxLength: 128 })
  @IsString({ message: 'password must be a string' })
  @IsNotEmpty({ message: 'password cannot be empty' })
  @MinLength(1, { message: 'password must be at least 1 character long' })
  @MaxLength(128, { message: 'password must not exceed 128 characters' })
  password: string;
}
