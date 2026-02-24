import { DataTypes } from "sequelize";
import sequelize from "../config/db.js"; // default import

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  boxId:{
    type:DataTypes.INTEGER,
  },
  statut:{
    type:DataTypes.STRING,
    defaultValue:"locked",
  }
});

// 🔹 Export par défaut
export default User;
