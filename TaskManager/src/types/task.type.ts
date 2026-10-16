export interface Task {
    id: string;
    title: string;
    description?: string;
    status: string;
    dueDate?: Date;
    userId: string;
    createdAt: Date;
}

export interface TaskCreateDTO {
    title: string;
    description?: string;
    status: string;
    dueDate?: Date;
    userId: string;
}

export interface TaskUpdateDTO {
    title?: string;
    description?: string;
    status?: string;
    dueDate?: Date;
    userId?: string;
}