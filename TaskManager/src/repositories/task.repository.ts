import { Pool } from "pg";
import type { Task, TaskCreateDTO, TaskUpdateDTO } from "../types/task.type.js";

export interface ITaskRepository {
    create(data: TaskCreateDTO): Promise<Task>;
    findAll(): Promise<Task[]>;
    findByUserId(userId: string): Promise<Task[]>;
    findById(id: string): Promise<Task | null>;
    update(id: string, data: TaskUpdateDTO): Promise<Task>;
    delete(id: string): Promise<void>;
}

export class TaskRepository implements ITaskRepository {
    constructor(
        private readonly pool: Pool
    ) { }

    async create(data: TaskCreateDTO): Promise<Task> {
        const { title, description, status, dueDate, userId } = data;
        const result = await this.pool.query<Task>(
            `
                INSERT INTO tasks (title, description, status, due_date, user_id)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING 
                    id, 
                    title, 
                    description, 
                    status, 
                    due_date AS "dueDate", 
                    user_id AS "userId", 
                    created_at AS "createdAt";
            `,
            [title, description, status, dueDate, userId]
        );
        return result.rows[0]!;
    }

    async findAll(): Promise<Task[]> {
        const result = await this.pool.query<Task>(
            `
                SELECT 
                    id, 
                    title, 
                    description, 
                    status, 
                    due_date AS "dueDate", 
                    user_id AS "userId", 
                    created_at AS "createdAt"
                FROM tasks
                ORDER BY created_at DESC;
            `
        );
        return result.rows;
    }

    async findByUserId(userId: string): Promise<Task[]> {
        const result = await this.pool.query<Task>(
            `
                SELECT 
                    id, 
                    title, 
                    description, 
                    status, 
                    due_date AS "dueDate", 
                    user_id AS "userId", 
                    created_at AS "createdAt"
                FROM tasks
                WHERE user_id = $1
                ORDER BY created_at DESC;
            `,
            [userId]
        );
        return result.rows;
    }

    async findById(id: string): Promise<Task | null> {
        const result = await this.pool.query<Task>(
            `
                SELECT 
                    id, 
                    title, 
                    description, 
                    status, 
                    due_date AS "dueDate", 
                    user_id AS "userId", 
                    created_at AS "createdAt"
                FROM tasks
                WHERE id = $1;
            `,
            [id]
        );
        return result.rows[0] ?? null;
    }

    async update(id: string, data: TaskUpdateDTO): Promise<Task> {
        const { title, description, status, dueDate, userId } = data;
        const result = await this.pool.query<Task>(
            `
                UPDATE tasks
                SET title = COALESCE($1, title),
                    description = COALESCE($2, description),
                    status = COALESCE($3, status),
                    due_date = COALESCE($4, due_date),
                    user_id = COALESCE($5, user_id)
                WHERE id = $6
                RETURNING 
                    id, 
                    title, 
                    description, 
                    status, 
                    due_date AS "dueDate", 
                    user_id AS "userId", 
                    created_at AS "createdAt";
            `,
            [title ?? null, description ?? null, status ?? null, dueDate ?? null, userId ?? null, id]
        );
        return result.rows[0]!;
    }

    async delete(id: string): Promise<void> {
        await this.pool.query(
            `
                DELETE FROM tasks
                WHERE id = $1;
            `,
            [id]
        );
    }
}

import { pool } from "../config/db.js";

export const taskRepository = new TaskRepository(pool);