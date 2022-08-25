import { Module, CacheModule, CacheInterceptor } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './app/user/user.module';
import { AuthModule } from './app/auth/auth.module';
import * as dotenv from 'dotenv';
import * as redisStore from 'cache-manager-redis-store';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MoviesModule } from './app/movies/movies.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: Number(process.env.DB_PORT),
      synchronize: true,
      entities: [__dirname + '/**/*.entity{.js,.ts}'],
    }),
    UserModule,
    AuthModule,
    CacheModule.register({
      store: redisStore,
      socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
      },
    }),
    MoviesModule,
    ClientsModule.register([
      {
        name: 'mks-challenge',
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST,
          port: 6379,
        },
      },
    ]),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
