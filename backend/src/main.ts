import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Permet à l'application mobile de se connecter (CORS)
  app.enableCors();
  
  // Le serveur écoute sur le port 3000
  await app.listen(3000);
  console.log(`🚀 Le serveur tourne sur : http://localhost:3000`);
}
bootstrap();