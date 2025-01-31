import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config(); 


const {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_PORT,
  DB_CONNECTION_LIMIT,
} = process.env;

if (!DB_HOST || !DB_USER || !DB_PASSWORD || !DB_NAME) {
  throw new Error("Missing required database environment variables");
}

const poolConnection = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: 3306,
  waitForConnections: true,
  connectionLimit: Number(DB_CONNECTION_LIMIT) || 10,
  queueLimit: 0,
});


export const db = drizzle({client:poolConnection});
