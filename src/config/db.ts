import {Sequelize} from 'sequelize';

const sequelize = new Sequelize(
    'todo_list',
    'root',
    'rootpass',{
        host:'localhost',
        dialect:'mysql',
        timezone : "+05:30"
    }
)

sequelize.authenticate().then(()=>{
    console.log("Connected Successfully")
}).catch((error)=>{
    console.log("Connection Error",error)
})

export default sequelize;