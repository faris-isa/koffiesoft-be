import { Sequelize } from 'sequelize-typescript';
import { Accounts } from './accounts';
import { databases } from "../../config.json";

const connection = new Sequelize(databases.path, {
  models: [Accounts]
});

export default connection;
