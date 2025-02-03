import { DataTypes } from "sequelize";
import { sequelize } from "../database/connection.js";

const Folder = sequelize.define(
  "Folder",
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
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
      parentFolderId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "Folders",
          key: "id",
        },
        onDelete: "CASCADE",
      },

      onDelete: "CASCADE",
    },
    type: {
      type: DataTypes.STRING,
      defaultValue: "folder",
    },
    filesCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "Folders",
    timestamps: true,
  }
);

export default Folder;
