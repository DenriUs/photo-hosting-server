import { config } from 'dotenv';

config();

const { PORT, JWT_SECRET, DB_CONNECTION_STRING } = process.env;

if (!PORT || !JWT_SECRET || !DB_CONNECTION_STRING) {
  throw new Error('Not all .env variables are configured');
}

const envConfig = {
  port: PORT,
  jwtSecret: JWT_SECRET,
  dbConnectionString: DB_CONNECTION_STRING,
}

export default envConfig;
