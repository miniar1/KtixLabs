import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

// Box Model - stores available boxes
const Box = sequelize.define('Box', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  boxId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  unlockCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  version: {
    type: DataTypes.STRING,
    defaultValue: '1.0',
  },
  folderPath: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  totalSteps: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'Boxes',
  timestamps: true,
});

export default Box;