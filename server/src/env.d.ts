declare namespace NodeJS {
  export interface ProcessEnv {
    DB: string;
    CLIENT_URL: string;
    JWT_SECRET: string;
    JWT_ACCOUNT_ACTIVATION: string;
    SENDGRID_API_KEY: string;
    EMAIL_FROM: string;
    EMAIL_TO: string;
    JWT_RESET_PASSWORD: string;
    GOOGLE_CLIENT_ID: string;
  }
}
