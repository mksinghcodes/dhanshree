import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../../.env'],
    }),
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
  providers: [AppService, PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
