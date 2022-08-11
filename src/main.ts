import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Pipes são classes que são executadas antes dos controllers serem chamados.
  // Geralemente são usadas para transformar dados vindos do front ou validá-los (que é o nosso caso ao usar o ValidationPipe)
  app.useGlobalPipes(new ValidationPipe({
    transform: true
  }));

  // Define um container no class-validator que utiliza a própria aplicação nest, permitindo assim que o container
  // de injeção de dependências do Nest seja utilizado também pelo class-validator (se liga na mandinga)
  useContainer(app.select(AppModule), { fallbackOnErrors: true }); 
  await app.listen(3000);
}
bootstrap();
