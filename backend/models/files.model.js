import { DataTypes } from "sequelize";
import { sequelize } from "../database/connection.js";

const File = sequelize.define(
  "File",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    folderId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "Folders",
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "Files",
    timestamps: true,
  }
);

export default File;
