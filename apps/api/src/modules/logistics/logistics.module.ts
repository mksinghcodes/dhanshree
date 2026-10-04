import { Module } from '@nestjs/common';
import { LogisticsService } from './logistics.service';
import { LogisticsController } from './logistics.controller';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [LogisticsController],
  providers: [LogisticsService, PrismaService],
  exports: [LogisticsService],
})
export class LogisticsModule {}
