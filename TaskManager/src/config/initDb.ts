import { pool } from './db.js';

export const initDatabase = async (): Promise<void> => {
  try {
    console.log('Đang khởi tạo database...');

    // Kích hoạt pgcrypto để dùng gen_random_uuid() và vector cho RAG sau này
    await pool.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);
    await pool.query(`CREATE EXTENSION IF NOT EXISTS "vector";`);

    // Tạo bảng users
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        role VARCHAR(20) DEFAULT 'user' NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Bảng "users" đã được tạo thành công!');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(20) DEFAULT 'pending' NOT NULL,
        due_date DATE,
        user_id UUID NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);
    console.log('Bảng "tasks" đã được tạo thành công!');


  } catch (error) {
    console.error('Lỗi khởi tạo database:', error);
  } finally {
    await pool.end();
  }
};

initDatabase();
