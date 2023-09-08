import { DataTypes, Model} from 'sequelize';
import sequelize from '../config/db';

class Todo extends Model {
  public id!: number;
  public taskName!: string;
  public creationTimestamp!: Date;
  public editTimestamp!: Date;
  public expiry!: Date;
  public completionStatus!: boolean;
  public deleted!: boolean;
}

Todo.init(
  {
    taskName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    creationTimestamp: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    editTimestamp: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    expiry: {
      type: DataTypes.DATE,
    },
    completionStatus: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
  },
  {
    sequelize,
    modelName: 'Todo',
    timestamps: false,
  }
);

export default Todo;
