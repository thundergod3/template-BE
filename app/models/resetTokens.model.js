import { Sequelize } from "sequelize";

import sequelize from "../configs/sequelize.js";

const ResetTokensModel = sequelize.define("reset_tokens", {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: Sequelize.STRING, allowNull: false },
  token: { type: Sequelize.STRING, allowNull: false },
});

export default ResetTokensModel;
