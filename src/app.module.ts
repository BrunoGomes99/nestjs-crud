import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { FiltroExcecaoHttp } from './common/filters/filtroExcecaoHttp.filter';
import { TransformResponseInterceptor } from './core/http/transformResponse.interceptor';
import { UsuarioModule } from './usuario/usuario.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './usuario/usuario.entity';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    //forwardRef(() => UsuarioModule),
    ConfigModule.forRoot(), // Esse método é importado para que o arquivo de configuração .env funcione corretamente
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: process.env.USUARIO_BANCO_DADOS,
      password: process.env.SENHA_BANCO_DADOS,
      database: process.env.NOME_BANCO_DADOS,
      entities: [Usuario],
      synchronize: true // Permite sincornizar os modelos informados abaixo com as tabelas do banco. Se algum modelo informado não tiver tabela, ele irá criar no bd
    }),
    UsuarioModule
    //SequelizeModule.forFeature([Usuario]), //Informa os modelos a serem mapeados
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: FiltroExcecaoHttp
    },
    // Define de forma global (por isso na app.module) um interceptor do tipo ClassSerializer
    // Para serializar e deserializar os dados na entrada e na saída dos dados da aplicação
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor
    }
  ],
})
export class AppModule {

  constructor(private dataSource: DataSource) {}
}
