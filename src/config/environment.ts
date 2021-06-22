import { config } from 'dotenv';

config();

const {
  PORT,
  JWT_SECRET,
  DB_CONNECTION_STRING,
  AZURE_STORAGE_CONNECTION_STRING,
  AZURE_STORAGE_ACCOUNT_URL,
  SERVICE_EMAIL,
  SERVICE_EMAIL_PASSOWRD,
} = process.env;

if (
  !PORT ||
  !JWT_SECRET ||
  !DB_CONNECTION_STRING ||
  !AZURE_STORAGE_CONNECTION_STRING ||
  !AZURE_STORAGE_ACCOUNT_URL ||
  !SERVICE_EMAIL ||
  !SERVICE_EMAIL_PASSOWRD
) {
  throw new Error('Not all .env variables are configured');
}

const envConfig = {
  port: PORT,
  jwtSecret: JWT_SECRET,
  dbConnectionString: DB_CONNECTION_STRING,
};

export default envConfig;
