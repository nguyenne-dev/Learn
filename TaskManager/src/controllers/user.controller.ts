import type { Request, Response } from 'express';
import type { IUserService } from '../services/user.service.js';
import { userService } from '../services/user.service.js';
import { AppError } from '../utils/appError.js';
import type { User } from '../types/user.type.js';

export class UserController {
  constructor(private readonly userService: IUserService) {}

  // Xóa mật khẩu trước khi trả về cho Client
  private sanitizeUser(user: User): Omit<User, 'passwordHash'> {
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  // Xử lý bắt lỗi tập trung
  private handleError(res: Response, error: unknown): void {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.message,
      });
      return;
    }

    console.error('Lỗi hệ thống không lường trước:', error);
    res.status(500).json({
      success: false,
      error: 'Lỗi máy chủ nội bộ (Internal Server Error)',
    });
  }

  // Đăng ký / Tạo người dùng mới
  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await this.userService.create(req.body);
      res.status(201).json({
        success: true,
        data: this.sanitizeUser(user),
      });
    } catch (error) {
      this.handleError(res, error);
    }
  };

  // Tìm theo email
  findByEmail = async (req: Request, res: Response): Promise<void> => {
    try {
      const email = req.params.email as string;
      const user = await this.userService.findByEmail(email);

      if (!user) {
        throw new AppError('Không tìm thấy người dùng với email này', 404);
      }

      res.status(200).json({
        success: true,
        data: this.sanitizeUser(user),
      });
    } catch (error) {
      this.handleError(res, error);
    }
  };

  // GET /users/:id - Tìm theo ID
  findById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;
      const user = await this.userService.findById(id);

      if (!user) {
        throw new AppError('Không tìm thấy người dùng', 404);
      }

      res.status(200).json({
        success: true,
        data: this.sanitizeUser(user),
      });
    } catch (error) {
      this.handleError(res, error);
    }
  };

  // GET /users - Lấy danh sách toàn bộ người dùng
  findAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      const users = await this.userService.findAll();
      res.status(200).json({
        success: true,
        data: users.map((u) => this.sanitizeUser(u)),
      });
    } catch (error) {
      this.handleError(res, error);
    }
  };

  // PUT /users/:id - Cập nhật người dùng
  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;
      const updatedUser = await this.userService.update(id, req.body);
      res.status(200).json({
        success: true,
        data: this.sanitizeUser(updatedUser),
      });
    } catch (error) {
      this.handleError(res, error);
    }
  };

  // DELETE /users/:id - Xóa người dùng
  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;
      await this.userService.delete(id);
      res.status(200).json({
        success: true,
        message: 'Xóa người dùng thành công',
      });
    } catch (error) {
      this.handleError(res, error);
    }
  };
}

export const userController = new UserController(userService);
