export enum AllowedFileCategory {
  PRODUCT_IMAGE = 'PRODUCT_IMAGE',
  KYC_DOCUMENT = 'KYC_DOCUMENT',
  DISPUTE_EVIDENCE = 'DISPUTE_EVIDENCE',
  STORE_AVATAR = 'STORE_AVATAR',
  BULK_CSV = 'BULK_CSV',
}

export interface FileValidationRule {
  allowedMimeTypes: string[];
  allowedExtensions: string[];
  maxSizeBytes: number;
  magicNumberCheck: (buffer: Buffer) => boolean;
}

export interface StoredFileRecord {
  fileId: string;
  category: AllowedFileCategory;
  originalFileNameSanitized: string;
  mimeType: string;
  sizeBytes: number;
  storagePath: string;
  publicUrl: string;
  uploadedAt: string;
  sha256Hash: string;
}
