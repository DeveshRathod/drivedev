import { sequelize } from "../database/connection.js";
import { DataTypes } from "sequelize";
import Folder from "./folders.model.js";
import File from "./files.model.js";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: "Email must be unique",
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "Users",
    timestamps: true,
  }
);

// User- Folder Relationship (One-to-Many)
User.hasMany(Folder, {
  foreignKey: "userId",
  as: "folders",
});
Folder.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

// User - File Relationship (One-to-Many)
User.hasMany(File, {
  foreignKey: "userId",
  as: "files",
});
File.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

//  Self-Referential Folder Relationship (One-to-Many)
Folder.hasMany(Folder, {
  foreignKey: "parentFolderId",
  as: "subfolders",
});
Folder.belongsTo(Folder, {
  foreignKey: "parentFolderId",
  as: "parentFolder",
});

//  Folder - File Relationship (One-to-Many)
Folder.hasMany(File, {
  foreignKey: "folderId",
  as: "files",
});
File.belongsTo(Folder, {
  foreignKey: "folderId",
  as: "folder",
});

export default User;
