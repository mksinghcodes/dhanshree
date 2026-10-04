import {
  Controller,
  Post,
  Get,
  Param,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Res,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { FileSecurityService } from './file-security.service';
import {
  AllowedFileCategory,
  StoredFileRecord,
} from './interfaces/file-security.types';
import { AuthenticatedRateLimit } from '../rate-limit';

@Controller('uploads')
@AuthenticatedRateLimit()
export class UploadsController {
  constructor(private readonly fileSecurityService: FileSecurityService) {}

  /**
   * Secure Image Upload Endpoint (Products, Banners, Store Avatars)
   * Enforces 5MB limit, JPEG/PNG/WebP magic bytes validation, and stores outside web root.
   */
  @Post('image')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: any,
  ): Promise<StoredFileRecord> {
    if (!file) {
      throw new BadRequestException('No image file provided in multipart request');
    }

    return this.fileSecurityService.processAndStoreFile(
      file.buffer,
      file.originalname,
      file.mimetype,
      AllowedFileCategory.PRODUCT_IMAGE,
    );
  }

  /**
   * Secure Document Upload Endpoint (Seller KYC, Trade License, Identity Proofs)
   * Enforces 10MB limit, PDF/JPEG/PNG magic bytes validation.
   */
  @Post('document')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(
    @UploadedFile() file: any,
  ): Promise<StoredFileRecord> {
    if (!file) {
      throw new BadRequestException('No document file provided in multipart request');
    }

    return this.fileSecurityService.processAndStoreFile(
      file.buffer,
      file.originalname,
      file.mimetype,
      AllowedFileCategory.KYC_DOCUMENT,
    );
  }

  /**
   * Secure Bulk Inventory CSV Upload Endpoint
   * Enforces 5MB limit, null-byte checks, and anti-formula injection.
   */
  @Post('csv')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  async uploadCsv(
    @UploadedFile() file: any,
  ): Promise<StoredFileRecord> {
    if (!file) {
      throw new BadRequestException('No CSV file provided in multipart request');
    }

    return this.fileSecurityService.processAndStoreFile(
      file.buffer,
      file.originalname,
      file.mimetype,
      AllowedFileCategory.BULK_CSV,
    );
  }

  /**
   * Secure File Delivery Stream
   *
   * Crucial Anti-Execution Protections:
   * 1. Files are served from isolated storage outside web root.
   * 2. X-Content-Type-Options: nosniff prevents browser MIME-sniffing execution.
   * 3. Content-Security-Policy: default-src 'none'; sandbox disables any script execution inside browser preview.
   * 4. Content-Disposition: attachment for non-image files forces download instead of browser execution.
   */
  @Get(':category/:fileId')
  async serveFile(
    @Param('fileId') fileId: string,
    @Res() res: Response,
  ): Promise<void> {
    const { record, buffer } = this.fileSecurityService.getFileForDelivery(fileId);

    // Apply strict non-executable HTTP response headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Content-Security-Policy', "default-src 'none'; sandbox");
    res.setHeader('Content-Type', record.mimeType);

    const isImage = record.mimeType.startsWith('image/');
    const dispositionType = isImage ? 'inline' : 'attachment';
    res.setHeader(
      'Content-Disposition',
      `${dispositionType}; filename="${record.originalFileNameSanitized}"`,
    );

    if (buffer) {
      res.send(buffer);
    } else {
      res.status(HttpStatus.OK).json({
        fileId: record.fileId,
        category: record.category,
        mimeType: record.mimeType,
        sizeBytes: record.sizeBytes,
        uploadedAt: record.uploadedAt,
      });
    }
  }
}
