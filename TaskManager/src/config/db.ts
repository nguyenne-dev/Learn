import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

export const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    max: 10,
    idleTimeoutMillis: 30000,
})

export const testConnection = async(): Promise<void> => {
    try {
        const client = await pool.connect();
        console.log('Database connection successful!');
        client.release();
    }
    catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
}

// Kiểm tra kết nối khi khởi động
testConnection();