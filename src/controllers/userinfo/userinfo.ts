import { Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { getRepository, createConnection } from "typeorm";
import { Tag } from "../../entity/tag";
import { User } from "../../entity/user";
import { Comment } from "../../entity/comment";
import { Wine } from "../../entity/wine";
const userRepository = getRepository(User);
dotenv.config();

const userinfo = async (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.headers.authorization;
    interface userInfo {
        id: number;
        email: string;
        nickname: string;
        likes?: number;
        image?: string;
        tags: Tag[];
        good?: Comment[];
        bad?: Comment[];
        wines?: Wine[];
    }

    if (authorization) {
        let token: string = authorization.split(" ")[1];
        let accessTokenData = jwt.verify(token, process.env.ACCTOKEN_SECRET!)as userInfo
        
        if (!accessTokenData) {
            res.json({ data: null, message: 'wrong accessToken' })
        } else {
            //수정해야 할 것 같음
            let userInfo = await userRepository.findOne({
                where: { email: accessTokenData.email }
            })
            console.log(userInfo)
            res.status(200).json({ data: userInfo, message: 'ok.' })
        }
    }else{
        res.json({ data: null, message: 'wrong accessToken' })
    }
}

export default userinfo;