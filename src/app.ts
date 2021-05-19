import express, { Application } from "express";
import https from "https";
import fs from "fs";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import "reflect-metadata";
import { createConnection } from "typeorm";
import ormconfig from "../ormconfig";
import passport from 'passport'
const connection = createConnection(ormconfig);

dotenv.config();

import index from './routers/index';
import auth from './routers/auth';


const port: number = 4000;
const app: Application = express();
const clientAddr = process.env.CLIENT_ADDR || "http://localhost:3000";

app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: [clientAddr],
    credentials: true,
    methods: ["GET", "POST", "OPTIONS", "DELETE", "PUT"],
  })
);
app.use(cookieParser());

const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:4000/auth/google/callback",
    passReqToCallback   : true
  },(accesToken:string,refreshToken:string)=>{console.log('토큰들',accesToken,refreshToken)}
));

app.use('/', index);
app.use('/auth', auth);

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
