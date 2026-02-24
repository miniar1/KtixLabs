import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./userModel.js";
import Box from "./boxModel.js";
const Progress = sequelize.define('UserBox', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: User, key: 'id' },
  },
  boxId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Boxes', key: 'id' },
  },
  unlockedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  currentStep: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  currentSubstep: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  completedSteps: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  progress: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  isCompleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'UserBoxes',
  timestamps: true,
  indexes: [{ unique: true, fields: ['userId', 'boxId'] }],
});

User.hasMany(UserBox, { foreignKey: 'userId', as: 'userBoxes' });
UserBox.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Box.hasMany(UserBox, { foreignKey: 'boxId', as: 'userBoxes' });
UserBox.belongsTo(Box, { foreignKey: 'boxId', as: 'box' });

export default Progress;