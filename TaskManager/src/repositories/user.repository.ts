import { Pool } from "pg";
import type { User, UserCreateDTO, UserUpdateDTO } from "../types/user.type.js";

export interface IUserRepository {
    create(data: UserCreateDTO): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    findAll(): Promise<User[]>;
    update(id: string, data: UserUpdateDTO): Promise<User>;
    delete(id: string): Promise<void>;
}

export class UserRepository implements IUserRepository {
    constructor(
        private readonly pool: Pool
    ) { }

    async create(data: UserCreateDTO): Promise<User> {
        const { firstName, lastName, email, password } = data;
        const result = await this.pool.query<User>(
            `
                INSERT INTO users (first_name, last_name, email, password_hash)
                VALUES ($1, $2, $3, $4)
                RETURNING 
                    id, 
                    first_name AS "firstName", 
                    last_name AS "lastName", 
                    email, 
                    role, 
                    password_hash AS "passwordHash",
                    created_at AS "createdAt";  
            `,
            [firstName, lastName, email, password]
        );
        return result.rows[0]!;
    }

    async findByEmail(email: string): Promise<User | null> {
        const result = await this.pool.query<User>(
            `
                SELECT
                    id,
                    first_name AS "firstName",
                    last_name AS "lastName",
                    email,
                    role,
                    password_hash AS "passwordHash",
                    created_at AS "createdAt"
                FROM users
                WHERE email = $1;
            `,
            [email]
        );
        return result.rows[0] ?? null;
    }

    async findById(id: string): Promise<User | null> {
        const result = await this.pool.query<User>(
            `
                SELECT 
                    id,
                    first_name AS "firstName",
                    last_name AS "lastName",
                    email,
                    role,
                    password_hash AS "passwordHash",
                    created_at AS "createdAt"
                FROM users
                WHERE id = $1;
            `,
            [id]
        );
        return result.rows[0] ?? null;
    }

    async findAll(): Promise<User[]> {
        const result = await this.pool.query<User>(
            `
                SELECT 
                    id,
                    first_name AS "firstName",
                    last_name AS "lastName",
                    email,
                    role,
                    password_hash AS "passwordHash",
                    created_at AS "createdAt"
                FROM users 
                ORDER BY created_at DESC;
            `
        );
        return result.rows;
    }

    async update(id: string, data: UserUpdateDTO): Promise<User> {
        const { firstName, lastName, email, password } = data;
        const result = await this.pool.query<User>(
            `
                UPDATE users
                SET
                    first_name = COALESCE($2, first_name),
                    last_name = COALESCE($3, last_name),
                    email = COALESCE($4, email),
                    password_hash = COALESCE($5, password_hash)
                WHERE id = $1
                RETURNING 
                    id,
                    first_name AS "firstName",
                    last_name AS "lastName",
                    email,
                    role,
                    password_hash AS "passwordHash",
                    created_at AS "createdAt";
            `,
            [id, firstName ?? null, lastName ?? null, email ?? null, password ?? null]
        );

        return result.rows[0]!;
    }

    async delete(id: string): Promise<void> {
        await this.pool.query(
            `DELETE FROM users WHERE id = $1;`,
            [id]
        );
    }
}

import { pool } from "../config/db.js";
export const userRepository = new UserRepository(pool);