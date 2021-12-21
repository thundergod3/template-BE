import { Sequelize } from "sequelize";

import sequelize from "../configs/sequelize.js";

import hashPassword from "../../utils/hashPassword.js";
import PropertiesModel from "./properties.model.js";

const UsersModel = sequelize.define("users", {
  id: {
    type: Sequelize.UUID,
    allowNull: false,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  fullName: { type: Sequelize.STRING, allowNull: false },
  password: { type: Sequelize.STRING, allowNull: false },
  phoneNumber: { type: Sequelize.STRING },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  roles: { type: Sequelize.JSONB, allowNull: false, defaultValue: ["tenant"] },
  status: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: "active", // ENUM: inActive | active
  },
});

UsersModel.hasMany(PropertiesModel);
PropertiesModel.belongsTo(UsersModel);

UsersModel.beforeCreate((user) => {
  const hashedPassword = hashPassword(user.password);
  user.password = hashedPassword;
});

export default UsersModel;
