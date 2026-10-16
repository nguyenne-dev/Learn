export type UserRole = 'admin' | 'user';

// Đối tượng User đầy đủ lấy từ Database lên
export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
    passwordHash: string;
    createdAt: Date; // Thêm ngày tạo
}

// Khi đăng ký tài khoản mới
export interface UserCreateDTO {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: UserRole; // Tùy chọn, mặc định backend sẽ tự gán 'user'
}

// Khi cập nhật thông tin cá nhân (chỉ gửi trường nào muốn sửa)
export interface UserUpdateDTO {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    role?: UserRole;
}