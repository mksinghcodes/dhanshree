import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_FILTER } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './database/prisma.service';
import { CountryModule } from './modules/countries/country.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CatalogModule } from './modules/catalog/catalog.module';
import { CartModule } from './modules/cart/cart.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { OrdersModule } from './modules/orders/orders.module';
import { SellerModule } from './modules/sellers/seller.module';
import { AdminModule } from './modules/admin/admin.module';
import { AdvancedModule } from './modules/advanced/advanced.module';
import { LogisticsModule } from './modules/logistics/logistics.module';
import { RateLimitModule, RateLimitGuard } from './modules/rate-limit';
import { GlobalExceptionFilter } from './common/filters';
import { SecurityHeadersMiddleware } from './common/middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../../.env'],
    }),
    RateLimitModule,
    CountryModule,
    AuthModule,
    UsersModule,
    CatalogModule,
    CartModule,
    PaymentsModule,
    OrdersModule,
    SellerModule,
    AdminModule,
    AdvancedModule,
    LogisticsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: RateLimitGuard,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
  exports: [PrismaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SecurityHeadersMiddleware).forRoutes('*');
  }
}
