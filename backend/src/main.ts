import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // CONFIGURATION CORS ULTRA-PERMISSIVE (Pour que le Web fonctionne)
  app.enableCors({
    origin: true, // Accepte toutes les origines (localhost, ngrok, vercel...)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  
  await app.listen(3000);
  console.log(`🚀 Le serveur tourne sur : http://localhost:3000`);
}
bootstrap();