import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    // Sem HTTPS no backend: o cookie de sessao do admin nao pode ser Secure.
    // Defina COOKIE_SECURE=true quando o backend for servido diretamente via HTTPS.
    cookieOptions: { secure: process.env.COOKIE_SECURE === 'true', sameSite: 'lax' },
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET,
      jwtExpiresIn: "7d",
      cookieSecret: process.env.COOKIE_SECRET,
    }
  },
  admin: {
    backendUrl: process.env.MEDUSA_BACKEND_URL,
  },
  modules: [
    {
      resolve: './src/modules/store-content',
    },
    {
      resolve: '@medusajs/medusa/file',
      options: {
        providers: [
          {
            resolve: '@medusajs/medusa/file-local',
            id: 'local',
            options: {
              backend_url: (process.env.MEDUSA_BACKEND_URL || 'http://localhost:9000') + '/static',
            },
          },
        ],
      },
    },
  ]
})