import { ConnectionOptions } from "typeorm";

let ormconfig: ConnectionOptions;
if (process.env.NODE_ENV) {
  ormconfig = require(`./config/` + process.env.NODE_ENV) as ConnectionOptions;
} else {
  ormconfig = require("./config/development") as ConnectionOptions;
}

export = ormconfig;
