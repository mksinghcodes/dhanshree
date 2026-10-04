import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Dhanshree-Bootstrap');
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // OpenAPI / Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('Dhanshree Multi-Vendor API')
    .setDescription(
      'World-class multi-vendor marketplace platform powering Nepal (NP), India (IN), and UAE (AE) storefronts',
    )
    .setVersion('1.0.0-phase1')
    .addTag('Health', 'System and database health checks')
    .addTag('Auth', 'Authentication, JWT, OTP, and 2FA')
    .addTag('Catalog', 'Products, Categories, Brands, and Pricing')
    .addTag('Orders', 'Cart, Checkout, and Order Lifecycle')
    .addTag('Payments', 'Country-specific payment gateways & Escrow')
    .addTag('Logistics', 'Shipping adapters and tracking')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.API_PORT || 4000;
  await app.listen(port);

  logger.log(`=======================================================`);
  logger.log(`🚀 Dhanshree API is live on port ${port}`);
  logger.log(`📡 Health Check URL: http://localhost:${port}/health`);
  logger.log(`📚 OpenAPI / Swagger: http://localhost:${port}/api/docs`);
  logger.log(`🌏 Target Markets: Nepal (NP), India (IN), UAE (AE)`);
  logger.log(`=======================================================`);
}

bootstrap();
