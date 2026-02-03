import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HashingService } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt.service';
import { Client } from 'src/client/entities/client.entity';
import jwtConfig from './config/jwt.config';

/**
 * Módulo responsável pela AUTENTICAÇÃO da aplicação.
 *
 * Responsabilidades:
 * - validar credenciais de login
 * - realizar hash e comparação de senhas
 * - gerar e configurar tokens JWT
 */
@Global()
@Module({
  imports: [
    /**
     * Registra a entidade Client para uso no processo de autenticação.
     * Utilizado principalmente para:
     * - buscar usuário por e-mail
     * - validar credenciais
     */
    TypeOrmModule.forFeature([Client]),

    /**
     * Registra as configurações do JWT no ConfigModule.
     * Essas configurações são definidas via registerAs('jwt')
     * e podem ser injetadas de forma tipada em outros serviços.
     */
    ConfigModule.forFeature(jwtConfig),

    /**
     * Configuração assíncrona do JwtModule.
     * Permite utilizar variáveis de ambiente e configurações centralizadas
     * para definir:
     * - secret
     * - audience
     * - issuer
     * - tempo de expiração do token
     */
    JwtModule.registerAsync(
      /* configuração assíncrona baseada no jwtConfig */
      jwtConfig as any
    ),
  ],

  /**
   * Controller responsável pelos endpoints de autenticação
   * (ex: POST /login).
   */
  controllers: [AuthController],

  providers: [
    /**
     * Abstração do serviço de hashing.
     * Permite trocar a implementação de hash sem impactar
     * a regra de negócio (ex: bcrypt → argon2).
     */
    {
      provide: HashingService,
      useClass: BcryptService,
    },

    /**
     * Serviço que contém a regra de negócio da autenticação.
     * Responsável por:
     * - validar usuário
     * - comparar senha
     * - gerar o JWT
     */
    AuthService,
  ],

  /**
   * Exporta dependências de autenticação para outros módulos.
   * Permite que:
   * - HashingService
   * - JwtModule
   * - ConfigModule
   *
   * sejam reutilizados em guards, strategies e outros módulos.
   */
  exports: [HashingService, JwtModule, ConfigModule],
})
export class AuthModule {}
