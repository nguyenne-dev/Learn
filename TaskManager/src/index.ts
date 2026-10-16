import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/user.routes.js';
import taskRoutes from './routes/task.routes.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Nạp JSON từ request body
app.use(express.json());

// Đăng ký routes
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

// Kiểm tra server
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`Server đang chạy tại: http://localhost:${PORT}`);
});

