import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientModule } from 'src/client/client.module';
import { ServiceModule } from 'src/service/service.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    ClientModule,
    ServiceModule,
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'postgres',
      database: 'api_agenda',
      password: '123456',
      autoLoadEntities: true, 
      synchronize: true,
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
