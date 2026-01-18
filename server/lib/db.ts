import { IdealaneDB } from '@idealane/node-sdk'

export const db = new IdealaneDB({
  connectionString: process.env.DATABASE_URL!,
  ssl: { rejectUnauthorized: false }
})

export const isDbReady = (): boolean => !!process.env.DATABASE_URL
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Honey@010",
  database: "grosgo_db",
  waitForConnections: true,
  connectionLimit: 10
});

export default pool;