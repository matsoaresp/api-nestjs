import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import type { ConfigType } from '@nestjs/config';
import { Repository } from 'typeorm';

import { LoginDto } from './dto/login.dto';
import { Client } from 'src/client/entities/client.entity';
import { HashingService } from './hashing/hashing.service';
import jwtConfig from './config/jwt.config';

@Injectable()
export class AuthService {
  /**
   * Construtor com injeção de dependências.
   *
   * - clientRepository: acesso ao banco de dados (Client)
   * - hashingService: responsável por hash e comparação de senhas
   * - jwtConfiguration: configurações tipadas do JWT
   * - jwtService: serviço responsável por assinar e validar tokens JWT
   */
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,

    private readonly hashingService: HashingService,

    /**
     * Injeta apenas o "namespace" jwt criado pelo registerAs('jwt').
     * Isso garante tipagem e evita uso direto de process.env.
     */
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,

    private readonly jwtService: JwtService,
  ) {}

  /**
   * Realiza a autenticação do usuário (login).
   *
   * Fluxo:
   * 1. Busca o cliente pelo e-mail
   * 2. Valida se o cliente existe
   * 3. Compara a senha informada com o hash salvo no banco
   * 4. Gera um JWT assinado com as configurações da aplicação
   *
   * @param loginDto Dados de login (email e senha)
   * @throws UnauthorizedException se usuário ou senha forem inválidos
   */
  async login(loginDto: LoginDto) {
    /**
     * Flag usada para armazenar o resultado da validação da senha.
     */
    let passwordIsValid = false;

    /**
     * Busca o cliente pelo e-mail informado.
     * Caso não exista, a autenticação é interrompida.
     */
    const cliente = await this.clientRepository.findOneBy({
      email: loginDto.email,
    });

    if (!cliente) {
      throw new UnauthorizedException('Pessoa não existe');
    }

    /**
     * Compara a senha informada com o hash armazenado.
     * Nunca é feita comparação direta de senha em texto puro.
     */
    passwordIsValid = await this.hashingService.compare(
      loginDto.password,
      cliente.password,
    );

    if (!passwordIsValid) {
      throw new UnauthorizedException('Senha inválida');
    }

    /**
     * Geração do access token JWT.
     *
     * Payload:
     * - sub: identificador único do usuário
     * - email: informação adicional para contexto
     *
     * Opções:
     * - audience: público-alvo do token
     * - issuer: emissor do token
     * - secret: chave de assinatura
     * - expiresIn: tempo de expiração (em segundos)
     */
    const accessToken = await this.jwtService.signAsync(
      {
        sub: cliente.id,
        email: cliente.email,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn: this.jwtConfiguration.jwtTtl,
      },
    );

    /**
     * Retorna apenas o token de acesso.
     * Nenhuma informação sensível do usuário é exposta.
     */
    return {
      accessToken,
    };
  }
}
