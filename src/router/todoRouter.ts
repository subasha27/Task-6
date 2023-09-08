import express from 'express';
import ToDoController from '../controller/ToDoController';
import authenticateToken from '../Helpers/AuthMiddleware';

const router = express.Router();
//To-Do Crud
router.post('/todos', authenticateToken, ToDoController.createTodo);
router.get('/todos', authenticateToken, ToDoController.getAllTodos);
router.get('/todos/:id', authenticateToken, ToDoController.getTodoById);
router.put('/todos/:id', authenticateToken, ToDoController.updateTodoById);
router.delete('/todosDelete/:id', authenticateToken, ToDoController.deleteTodoById);
router.put('/todos/restore/:id',authenticateToken,ToDoController.restore);
router.get('/expiredTask',authenticateToken,ToDoController.expiredTask);

export default router;