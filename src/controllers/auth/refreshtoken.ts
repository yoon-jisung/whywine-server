import { Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto'
import dotenv from 'dotenv';
import {getRepository} from "typeorm";
import {User} from '../../entity/user';
const userRepository = getRepository(User);
dotenv.config();

const refreshTokenReq = async (req: Request, res: Response, next: NextFunction) => {

}

export default refreshTokenReq;