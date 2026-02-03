import { registerAs } from '@nestjs/config';

/**
 * Configuração do JWT usando o ConfigModule do NestJS.
 *
 * registerAs cria um "namespace" de configuração chamado 'jwt',
 * permitindo acessar esses valores via ConfigService:
 * ex: configService.get('jwt.secret')
 */
export default registerAs('jwt', () => {
  return {
    /**
     * Chave secreta usada para ASSINAR e VALIDAR o JWT.
     * Deve ser mantida segura e nunca versionada no repositório.
     */
    secret: process.env.JWT_SECRET,

    /**
     * Audience (aud) do token.
     * Define quem pode consumir esse JWT (ex: web, mobile, api).
     * Ajuda a evitar uso do token em sistemas indevidos.
     */
    audience: process.env.JWT_TOKEN_AUDIENCE,

    /**
     * Issuer (iss) do token.
     * Identifica quem emitiu o JWT (ex: sua API de autenticação).
     */
    issuer: process.env.JWT_TOKEN_ISSUER,

    /**
     * Tempo de vida do token (em segundos).
     * Converte a variável de ambiente para número.
     * Caso não exista, usa 3600 segundos (1 hora) como padrão.
     */
    jwtTtl: Number(process.env.JWT_TTL) ?? 3600,
  };
});
