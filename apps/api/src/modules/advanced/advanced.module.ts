import { Module } from '@nestjs/common';
import { AdvancedService } from './advanced.service';
import { AdvancedController } from './advanced.controller';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [AdvancedController],
  providers: [AdvancedService, PrismaService],
  exports: [AdvancedService],
})
export class AdvancedModule {}
