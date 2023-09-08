import { Request, Response } from 'express';
import Todo from '../model/ToDoModel';
import {Op} from 'sequelize';

class TodoCrud {
    async createTodo(req: Request, res: Response) {
        try {
            const existingTodo = await Todo.findOne({ where: { taskName: req.body.taskName }, });
            if (existingTodo) return res.status(400).json({ error: 'Todo with the same taskName already exists' });
            const todo = await Todo.create(req.body);
            return res.status(201).json(todo);
        } catch (error) {
            console.error(error)
            return res.status(500).json({ error: 'Failed to create TODO item' });
        }
    }

    async getAllTodos(req: Request, res: Response) {
        try {
            const todos = await Todo.findAll();
            return res.status(200).json(todos);
        } catch (error) {
            return res.status(500).json({ error: 'Failed to fetch TODO items' });
        }
    }

    async getTodoById(req: Request, res: Response) {
        const id = req.params.id;
        try {
            const todo = await Todo.findByPk(id);
            if (!todo) {
                return res.status(404).json({ error: 'TODO item not found' });
            }
            return res.status(200).json(todo);
        } catch (error) {
            return res.status(500).json({ error: 'Failed to fetch TODO item' });
        }
    }

    async updateTodoById(req: Request, res: Response) {
        const id = req.params.id;
        try {
            const existingTodo = await Todo.findOne({ where: { id } });
            if (!existingTodo) return res.status(400).json({ error: 'Todo does not exists' });
            const updatedRows = await Todo.update(req.body, { where: { id } });
            return res.status(200).json({ message: 'TODO item updated successfully' });
        } catch (error) {
            return res.status(500).json({ error: 'Failed to update TODO item' });
        }
    }

    async deleteTodoById(req: Request, res: Response) {
        const id = req.params.id;
        try {
            const todo = await Todo.findByPk(id);

            if (!todo) return res.status(404).json({ error: 'TODO item not found' });

            await todo.update({ deleted: true });
            return res.status(200).send({ message: 'ToDo Deleted' });
        } catch (error) {
            return res.status(500).json({ error: 'Failed to delete TODO item' });
        }
    }
    async restore(req: Request, res: Response) {
        const id = req.params.id;
        try {
            const todo = await Todo.findByPk(id);
            if (!todo) {
                return res.status(404).json({ error: 'TODO item not found' });
            }
            
            await todo.update({ deleted: false });
            return res.status(200).json({ message: 'TODO item restored successfully' });
        } catch (error) {
            return res.status(500).json({ error: 'Failed to restore TODO item' });
        }
    };
    async expiredTask(req: Request, res: Response) {
        const currentDate = new Date();
        try {
            const todo = await Todo.findAll({
                where:
                    { expiry: { [Op.lt]: currentDate, } },
                order: [['expiry', 'DESC']]
            });
            return res.status(200).json({ message: "Expired Task", todo });
        } catch (error) {
            return res.status(500).json({ Message: 'Failed to fetch TODO item' });
        }
    }
}

export default new TodoCrud();
