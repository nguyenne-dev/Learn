import { Router } from 'express';
import { taskController } from '../controllers/task.controller.js';

const router = Router();

router.post('/', taskController.create);
router.get('/', taskController.findAll);
router.get('/user/:userId', taskController.findByUserId);
router.get('/:id', taskController.findById);
router.put('/:id', taskController.update);
router.delete('/:id', taskController.delete);

export default router;
