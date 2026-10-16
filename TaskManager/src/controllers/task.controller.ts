import type { Request, Response } from 'express';
import type { ITaskService } from '../services/task.service.js';
import { taskService } from '../services/task.service.js';
import { AppError } from '../utils/appError.js';

export class TaskController {
  constructor(private readonly taskService: ITaskService) {}

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

  // POST /api/tasks - Tạo task mới
  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const task = await this.taskService.create(req.body);
      res.status(201).json({
        success: true,
        data: task,
      });
    } catch (error) {
      this.handleError(res, error);
    }
  };

  // GET /api/tasks - Lấy danh sách tất cả task
  findAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      const tasks = await this.taskService.findAll();
      res.status(200).json({
        success: true,
        data: tasks,
      });
    } catch (error) {
      this.handleError(res, error);
    }
  };

  // GET /api/tasks/user/:userId - Lấy danh sách task của một user
  findByUserId = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.userId as string;
      const tasks = await this.taskService.findByUserId(userId);
      res.status(200).json({
        success: true,
        data: tasks,
      });
    } catch (error) {
      this.handleError(res, error);
    }
  };

  // GET /api/tasks/:id - Lấy chi tiết task theo id
  findById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;
      const task = await this.taskService.findById(id);

      if (!task) {
        throw new AppError('Không tìm thấy task', 404);
      }

      res.status(200).json({
        success: true,
        data: task,
      });
    } catch (error) {
      this.handleError(res, error);
    }
  };

  // PUT /api/tasks/:id - Cập nhật task
  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;
      const updatedTask = await this.taskService.update(id, req.body);
      res.status(200).json({
        success: true,
        data: updatedTask,
      });
    } catch (error) {
      this.handleError(res, error);
    }
  };

  // DELETE /api/tasks/:id - Xóa task
  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;
      await this.taskService.delete(id);
      res.status(200).json({
        success: true,
        message: 'Xóa task thành công',
      });
    } catch (error) {
      this.handleError(res, error);
    }
  };
}

export const taskController = new TaskController(taskService);
