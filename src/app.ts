import express, { Application } from "express";
import https from "https";
import fs from "fs";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import expressSession from 'express-session';
import passport from 'passport';
import dotenv from "dotenv";
import { createConnection } from "typeorm";
import "reflect-metadata";

import passportConfig from './utils/strategy/index';
import indexRouter from "./routers/index";
import userinfoRouter from "./routers/userinfo";
import authRouter from "./routers/auth";
import userRouter from "./routers/user";
import imageRouter from "./routers/image";
import mainRouter from "./routers/main";
import ormconfig from "../ormconfig";
dotenv.config();

const port: number = 4000;
const app: Application = express();
const clientAddr = /* process.env.CLIENT_ADDR || */ "https://localhost:3000";

const connection = createConnection(ormconfig);

app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: [clientAddr],
    credentials: true,
    methods: ["GET", "POST", "OPTIONS", "DELETE", "PUT"],
  })
);


passportConfig();
app.use(expressSession({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET!,
  cookie: {
      path: '/',
      sameSite: 'none',
      httpOnly: false,
      secure: true
  },
}));
app.use(cookieParser());
app.use(passport.initialize())
app.use(passport.session());
app.use("/userinfo", indexRouter);
app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/userinfo", userinfoRouter);
app.use("/image", imageRouter);
app.use("/user", userRouter);
app.use("/main", mainRouter);
let server;
if (fs.existsSync("./key.pem") && fs.existsSync("./cert.pem")) {
  server = https
    .createServer(
      {
        key: fs.readFileSync("./key.pem", "utf-8"),
        cert: fs.readFileSync("./cert.pem", "utf-8"),
      },
      app
    )
    .listen(port, () => {
      console.log("https server on " + port);
    });
} else {
  server = app.listen(8080, async () => {
    console.log("http server on " + 8080);
  });
}
