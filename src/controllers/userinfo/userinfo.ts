import { Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto'
import dotenv from 'dotenv';
import axios, { AxiosResponse } from "axios";
import {getRepository} from "typeorm";
import {User} from '../../entity/user';
const userRepository = getRepository(User);
dotenv.config();

const userinfo = async (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.headers.authorization;
        let accessTokenData: any
        if (authorization) {
            let token = authorization.split(" ")[1];
            try {
                accessTokenData = jwt.verify(token, process.env.JWT_SECRET!)
            }
            catch (e) {
                accessTokenData = {};
            }
        }
        if (accessTokenData = {}) {
            res.json({ data: null, message: 'wrong accessToken' })
        } else {
            let userInfo = await userRepository.findOne({
                where: { email: accessTokenData.email }
            })
            /* if(!userInfo){
                res.status(200).json({ data: userInfo.dataValues, message: "게스트용 토큰이 발급되었습니다" })
            }else{
                delete userInfo.dataValues.password;
                res.status(200).json({ data: userInfo.dataValues, message: "토큰이 발급되었습니다" })
            } */
            res.status(200).json({ data: userInfo, message: 'ok.' })
        }
}

export default userinfo;