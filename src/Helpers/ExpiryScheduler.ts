import cron from 'node-cron';
import Todo from '../model/ToDoModel';
import EmailService from '../Helpers/Nodemailer';
import { Op } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const cronge = cron.schedule('* * * * *', async () => {
    try {
        const currentTime = new Date();
        const expiredTodos = await Todo.findAll({
            where: {
                expiry: {
                    [Op.lt]: currentTime,
                },
                completionStatus: false,
            },
        });

        expiredTodos.forEach((todo) => {
            const subject = `Task Expired: ${todo.taskName}`;
            const text = `Task Name: ${todo.taskName}\nExpiry Date: ${todo.expiry}`;
            const to = process.env.user as string;

            EmailService.sendEmail(to, subject, text);
        });
    } catch (error) {
        console.error('Error scheduling notifications:', error);
    }
});


export default cronge