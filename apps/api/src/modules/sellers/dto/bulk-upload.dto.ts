import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BulkUploadProductsDto {
  @ApiProperty({ example: 'sku,title,category,price,stock,warehouse\nSKU-1,Product 1,cat-1,100,10,wh-1' })
  @IsString({ message: 'csvContent must be a string' })
  @IsNotEmpty({ message: 'csvContent cannot be empty' })
  @MaxLength(10000000, { message: 'csvContent exceeds maximum allowed size (10MB)' })
  csvContent: string;
}
