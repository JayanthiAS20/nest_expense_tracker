import { DataSource } from 'typeorm';
import dbconfig from './db.config';

export const AppDataSource = new DataSource(dbconfig);
