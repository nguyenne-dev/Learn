import type { User, UserCreateDTO, UserUpdateDTO } from "../types/user.type.js";
import { userRepository, type IUserRepository } from "../repositories/user.repository.js";
import { AppError } from "../utils/appError.js";
import bcrypt from "bcrypt";

export interface IUserService {
    create(data: UserCreateDTO): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    findAll(): Promise<User[]>;
    update(id: string, data: UserUpdateDTO): Promise<User>;
    delete(id: string): Promise<void>;
}

export class UserService implements IUserService {
    constructor(
        private readonly userRepository: IUserRepository
    ) { }

    async create(data: UserCreateDTO): Promise<User> {
        const existingUser = await this.userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new AppError('Email đã tồn tại', 409);
        }
        data.password = await bcrypt.hash(data.password, 10);
        // Gọi repo để insert DB
        return await this.userRepository.create(data);
    }

    async findByEmail(email: string): Promise<User | null> {
        // Gọi repo để query DB
        return await this.userRepository.findByEmail(email);
    }

    async findById(id: string): Promise<User | null> {
        // Gọi repo để query DB
        return await this.userRepository.findById(id);
    }

    async findAll(): Promise<User[]> {
        // Gọi repo để query DB
        return await this.userRepository.findAll();
    }

    async update(id: string, data: UserUpdateDTO): Promise<User> {
        // Tìm user theo id
        const existingUser = await this.userRepository.findById(id);
        if (!existingUser) {
            throw new AppError('Không tìm thấy user', 404);
        }
        if (data.email) {
            const userByEmail = await this.userRepository.findByEmail(data.email);
            if (userByEmail && userByEmail.id !== id) {
                throw new AppError('Email đã tồn tại', 409);
            }
        }
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }
        // Gọi repo để update DB
        return await this.userRepository.update(id, data);
    }

    async delete(id: string): Promise<void> {
        // Tìm user theo id
        const existingUser = await this.userRepository.findById(id);
        if (!existingUser) {
            throw new AppError('Không tìm thấy user', 404);
        }
        // Gọi repo để delete DB
        await this.userRepository.delete(id);
    }
}

export const userService = new UserService(userRepository);