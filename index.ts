import express from 'express';
import route from './src/router/router';
import todoroute from './src/router/todoRouter';
import sequelize from './src/config/db';
import dotenv from 'dotenv';
dotenv.config();
import  cronge  from './src/Helpers/ExpiryScheduler';
const cringe = cronge;


const app = express();
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use('/api',route);
app.use('/api',todoroute);

sequelize.sync();

const PORT = 2500||process.env.PORT
app.listen(PORT,()=>{
    console.log(`Server Running in the Port: ${PORT}`)
})