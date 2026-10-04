import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { StrictValidationPipe } from './common/validation';
import { GlobalExceptionFilter } from './common/filters';

async function bootstrap() {
  const logger = new Logger('Dhanshree-Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Disable Express technology fingerprint (X-Powered-By: Express)
  const httpAdapter = app.getHttpAdapter();
  if (httpAdapter && typeof (httpAdapter as any).getInstance === 'function') {
    const expressInstance = (httpAdapter as any).getInstance();
    if (expressInstance && typeof expressInstance.disable === 'function') {
      expressInstance.disable('x-powered-by');
    }
  }

  // Hardened CORS policy: Restricts access to authorized storefront origins & Vercel deployments
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'https://dhanshree-omega.vercel.app',
    process.env.FRONTEND_URL,
  ].filter(Boolean) as string[];

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      try {
        const hostname = new URL(origin).hostname;
        if (
          allowedOrigins.includes(origin) ||
          hostname === 'localhost' ||
          hostname === '127.0.0.1' ||
          hostname.endsWith('.vercel.app') ||
          process.env.NODE_ENV !== 'production'
        ) {
          return callback(null, true);
        }
      } catch {
        // Fall through to reject
      }
      return callback(new Error('Blocked by CORS policy: Origin not allowed'), false);
    },
    credentials: true,
  });

  // Global Exception Filter: Intercepts all 4xx/5xx exceptions, Prisma errors, and uncaught exceptions.
  // Replaces internal DB error messages, table schemas, and stack traces with standardized sanitized payloads.
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Strict schema validation: Rejects any input that violates type, length, or format.
  // Rejects unexpected properties (forbidNonWhitelisted: true). Never sanitizes/escapes.
  app.useGlobalPipes(new StrictValidationPipe());

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
