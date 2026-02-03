import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { Client } from 'src/client/entities/client.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HashingService } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt.service';
import jwtConfig from './config/jwt.config';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Client]),

    // registra o namespace "jwt"
    ConfigModule.forFeature(jwtConfig),

    // configuração correta do JwtModule
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const jwt = configService.get('jwt');

        return {
          secret: jwt.secret,
          signOptions: {
            audience: jwt.audience,
            issuer: jwt.issuer,
            expiresIn: jwt.jwtTtl,
          },
        };
      },
    }),
  ],

  controllers: [AuthController],

  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    AuthService,
  ],

  exports: [HashingService, JwtModule, ConfigModule],
})
export class AuthModule {}
