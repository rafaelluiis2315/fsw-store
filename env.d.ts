declare namespace NodeJS {
  interface ProcessEnv {
    POSTGRES_PRISMA_URL: string;
    POSTGRES_URL_NON_POOLING: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    NEXT_PUBLIC_STRIPE_PUBLIC_KEY: string;
    KEY_CUSTOM_LOGIN: string;
    STRIPE_SECRET_KEY: string;
    STRIPE_WEBHOOK_SECRET_KEY: string;
    NEXTAUTH_SECRET: string;
    HOST_URL: string;
  }
}