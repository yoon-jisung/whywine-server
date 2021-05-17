import express, { Application } from 'express';
import https from 'https';
import fs from 'fs';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

const port: number = 4000;
const app: Application = express();
const clientAddr = process.env.CLIENT_ADDR || 'https://localhost:3000'

app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors(
    {
        origin: [clientAddr],
        credentials: true,
        methods: ["GET", "POST", "OPTIONS", "DELETE", "PUT"]
    }
    ));
app.use(cookieParser());

app.get(
    "/",
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
        res.send("hello typescript express!");
    }
);

let server;

if (fs.existsSync('./key.pem') && fs.existsSync('./cert.pem')) {
    server = https.createServer(
        {
            key: fs.readFileSync('./key.pem', 'utf-8'),
            cert: fs.readFileSync ('./cert.pem', 'utf-8')
        },
        app
    ).listen(port, () => {
        console.log('https server on ' + port);
        })
};