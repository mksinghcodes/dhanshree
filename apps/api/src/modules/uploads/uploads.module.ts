import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { FileSecurityService } from './file-security.service';

@Module({
  controllers: [UploadsController],
  providers: [FileSecurityService],
  exports: [FileSecurityService],
})
export class UploadsModule {}
