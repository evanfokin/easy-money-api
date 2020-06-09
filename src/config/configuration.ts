export const configuration = () => ({
  secret: process.env.APP_SECRET || 'secret',
  port: parseInt(process.env.PORT) || 3000,
  database: {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT) || 5432,
    username: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'secret',
    database: process.env.POSTGRES_DATABASE || 'easy-money'
  }
});

export default configuration;
