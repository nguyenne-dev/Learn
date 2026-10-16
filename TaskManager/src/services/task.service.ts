import { AppError } from "../utils/appError.js";
import type { ITaskRepository } from "../repositories/task.repository.js";
import type { IUserRepository } from "../repositories/user.repository.js";
import type { TaskCreateDTO, TaskUpdateDTO, Task } from "../types/task.type.js";

export interface ITaskService {
    create(data: TaskCreateDTO): Promise<Task>;
    findAll(): Promise<Task[]>;
    findByUserId(userId: string): Promise<Task[]>;
    findById(id: string): Promise<Task | null>;
    update(id: string, data: TaskUpdateDTO): Promise<Task>;
    delete(id: string): Promise<void>;
}

export class TaskService implements ITaskService {
    constructor(
        private readonly taskRepository: ITaskRepository,
        private readonly userRepository: IUserRepository
    ) {}

    async create(data: TaskCreateDTO): Promise<Task> {
        const existingUser = await this.userRepository.findById(data.userId);
        if (!existingUser) {
            throw new AppError('Không tìm thấy user', 404);
        }
        // Gọi repo để insert DB
        return await this.taskRepository.create(data);
    }

    async findAll(): Promise<Task[]> {
        // Gọi repo để query DB
        return await this.taskRepository.findAll();
    }

    async findByUserId(userId: string): Promise<Task[]> {
        const existingUser = await this.userRepository.findById(userId);
        if (!existingUser) {
            throw new AppError('Không tìm thấy user', 404);
        }
        // Gọi repo để query DB
        return await this.taskRepository.findByUserId(userId);
    }

    async findById(id: string): Promise<Task | null> {
        // Gọi repo để query DB
        return await this.taskRepository.findById(id);
    }

    async update(id: string, data: TaskUpdateDTO): Promise<Task> {
        // Tìm task theo id
        const existingTask = await this.taskRepository.findById(id);
        if (!existingTask) {
            throw new AppError('Không tìm thấy task', 404);
        }
        if (data.userId) {
            const user = await this.userRepository.findById(data.userId);
            if (!user) {
                throw new AppError('Không tìm thấy user mới', 404);
            }
        }
        // Gọi repo để update DB
        return await this.taskRepository.update(id, data);
    }

    async delete(id: string): Promise<void> {
        // Tìm task theo id
        const existingTask = await this.taskRepository.findById(id);
        if (!existingTask) {
            throw new AppError('Không tìm thấy task', 404);
        }
        // Gọi repo để delete DB
        await this.taskRepository.delete(id);
    }
}

import { taskRepository } from "../repositories/task.repository.js";
import { userRepository } from "../repositories/user.repository.js";

export const taskService = new TaskService(taskRepository, userRepository);