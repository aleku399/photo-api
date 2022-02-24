import * as path from "path";
import Sequelize from "sequelize";
import walkSync from "walk-sync";
import database_config from "../config/database.json";
import { enableQueryLogging, safeEnvironment } from "./config";
import { PhotoModel } from "./photo/model";

export interface Models {
  Photo: PhotoModel;
}

export interface Config {
  logging?: boolean;
  seederStorage?: string;
  use_env_variable?: string;
}

const config: Config = database_config[safeEnvironment()];

const sequelizePool: Sequelize.PoolOptions = {
  max: 5,
  min: 0,
  idle: 20000,
  acquire: 30000
};

interface Validator extends Sequelize.Validator {
  notNull(item: string | number | boolean): boolean;
}

// Removes deprecation warning when customizing allowNull validation error
// https://github.com/sequelize/sequelize/issues/1500
(Sequelize.Validator as Validator).notNull = function (item) {
  return !this.isNull(item);
};

function createSequelize(
  config: Config,
  pool: Sequelize.PoolOptions
): Sequelize.Sequelize {
  const configuration: Sequelize.Options = {
    dialect: "postgres",
    dialectOptions: {
      ssl: safeEnvironment() === "production"
    },
    pool,
    logging: enableQueryLogging,
    // tslint:disable-next-line: max-line-length
    // kicks away warning: sequelize deprecated String based operators are now deprecated. Please use Symbol based operators for better security, read more at http://docs.sequelizejs.com/manual/tutorial/querying.html#operators node_modules/sequelize/lib/sequelize.js:245:13
    operatorsAliases: false,
    ...config
  };
  return new Sequelize(process.env[config.use_env_variable], configuration);
}

export const sequelize = createSequelize(config, sequelizePool);

function loadModels(sequelize: Sequelize.Sequelize): Models {
  return walkSync(__dirname, {
    globs: ["**/*/model.js"]
  })
    .map((filename: string) => {
      return sequelize.import(path.join(__dirname, filename));
    })
    .reduce(
      (models, model) => ({
        ...models,
        [model.name]: model
      }),
      {} as Models
    );
}

function associateModels(models: Models) {
  Object.keys(models).forEach(function (name: keyof Models) {
    if (models[name].associate) {
      models[name].associate(sequelize.models);
    }
  });
}

function getModels(sequelize: Sequelize.Sequelize) {
  const models = loadModels(sequelize);
  associateModels(models);
  return models;
}

export const models = getModels(sequelize);
