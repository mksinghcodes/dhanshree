import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsIn,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CountryCode } from '@dhanshree/shared';
import { IsStrictText } from '../../../common/validation';

export class ChatMessageDto {
  @ApiProperty({ enum: ['user', 'assistant'], example: 'user' })
  @IsIn(['user', 'assistant'], { message: "role must be either 'user' or 'assistant'" })
  role: 'user' | 'assistant';

  @ApiProperty({ example: 'Recommend top rated wireless earbuds available in Nepal under 10000 NPR' })
  @IsStrictText({
    minLength: 1,
    maxLength: 2000,
    message: 'content must be between 1 and 2000 characters and cannot contain HTML markup',
  })
  content: string;
}

export class AiChatPromptDto {
  @ApiProperty({ enum: CountryCode, example: CountryCode.NEPAL })
  @IsEnum(CountryCode, { message: 'countryCode must be a valid CountryCode (NP, IN, AE)' })
  countryCode: CountryCode;

  @ApiProperty({ type: [ChatMessageDto] })
  @IsArray({ message: 'messages must be an array' })
  @ArrayMinSize(1, { message: 'messages must contain at least 1 message' })
  @ArrayMaxSize(50, { message: 'messages history cannot exceed 50 items' })
  @ValidateNested({ each: true })
  @Type(() => ChatMessageDto)
  messages: ChatMessageDto[];
}
