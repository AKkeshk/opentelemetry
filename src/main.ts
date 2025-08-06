import './instrumentation';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TelemetryInterceptor } from './telemetry.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new TelemetryInterceptor());
  console.log('TelemetryInterceptor running...');

  await app.listen(3000);
}
bootstrap();
