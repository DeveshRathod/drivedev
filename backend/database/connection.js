import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.DB_USER,
  process.env.PASSWORD,
  {
    host: process.env.HOST,
    port: process.env.DB_PORT,
    logging: false,
    dialect: "mysql",
  }
);

export const connect = async () => {
  try {
    await sequelize.authenticate();
    console.log("db connected");

    await sequelize.sync();
    console.log("database synced");
  } catch (error) {
    console.log(`Error connected DB! :  ${error}`);
  }
};

export { sequelize };
