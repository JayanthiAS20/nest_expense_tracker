import 'reflect-metadata';
import { DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

config();

const configService = new ConfigService();

const dbconfig: DataSourceOptions = {
  type: 'mysql',
  host: configService.get('DATABASE_HOST'),
  port: +configService.get('DATABASE_PORT'),
  username: configService.get('DATABASE_USER'),
  password: configService.get('DATABASE_PASSWORD'),
  database: configService.get('DATABASE_NAME'),
  // entities: [__dirname + "/../**/entities/**/*.entity{.ts,.js}"],
  entities: [join(__dirname + '/../**/*.entity.{js,ts}')],

  // We are using migrations, synchronize should be set to false.
  synchronize: false,

  // Run migrations automatically,
  // you can disable this if you prefer running migration manually.
  migrationsRun: false,

  // Allow both start:prod and start:dev to use migrations
  // __dirname is either dist or src folder, meaning either
  // the compiled js in prod or the ts in dev.
  migrations: [join(__dirname + '/../database/migrations/**/*{.ts,.js}')],
};

export default dbconfig;
