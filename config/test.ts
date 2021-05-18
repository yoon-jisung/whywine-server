require("dotenv").config();

const development: object = {
  type: "mysql",
  host: process.env.TYPEORM_HOST_AWS,
  username: process.env.TYPEORM_USERNAME_AWS,
  password: process.env.TYPEORM_PASSWORD_AWS,
  database: process.env.TYPEORM_DATABASE_AWS_TEST,
  port: process.env.TYPEORM_PORT_AWS,
  synchronize: true,
  logging: false,
  entities: process.env.TYPEORM_ENTITIES!.split(","),
  migrations: ["src/migration/**/*.ts"],
  subscribers: ["src/subscriber/**/*.ts"],
  cli: {
    entitiesDir: "src/entity",
    migrationsDir: "src/migration",
    subscribersDir: "src/subscriber",
  },
};
export default development;
