import { Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto'
import dotenv from 'dotenv';
import passport from 'passport';
dotenv.config();

const googlecallback = async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("google")
}

export default googlecallback;