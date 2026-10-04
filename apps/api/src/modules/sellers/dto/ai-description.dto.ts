import { ArrayMaxSize, IsArray, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsStrictText } from '../../../common/validation';

export class AiDescriptionDto {
  @ApiProperty({ example: 'Wireless Bluetooth Earbuds' })
  @IsStrictText({
    minLength: 3,
    maxLength: 200,
    message: 'title must be between 3 and 200 characters and cannot contain HTML markup',
  })
  title: string;

  @ApiProperty({ example: 'Consumer Electronics' })
  @IsStrictText({
    minLength: 2,
    maxLength: 100,
    message: 'category must be between 2 and 100 characters',
  })
  category: string;

  @ApiPropertyOptional({ example: ['Active Noise Cancellation', '30-hour battery', 'IPX5 Water Resistant'] })
  @IsOptional()
  @IsArray({ message: 'keyFeatures must be an array' })
  @ArrayMaxSize(20, { message: 'keyFeatures cannot exceed 20 items' })
  @IsString({ each: true, message: 'Each key feature must be a string' })
  keyFeatures?: string[];
}
