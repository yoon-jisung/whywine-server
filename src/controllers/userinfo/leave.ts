import { Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { getRepository, getConnection } from "typeorm";
import { User } from "../../entity/user";


dotenv.config();

const leave = async (req: Request, res: Response, next: NextFunction) => {
    const userRepository = getRepository(User);
    const authorization = req.headers.authorization;
    interface userInfo {
        id: number;
        email: string;
        nickname: string;
        likes?: number;
        image?: Buffer;
    }
    if (authorization) {
        let token: string = authorization.split(" ")[1];
        let {id} = jwt.verify(token, process.env.ACCTOKEN_SECRET!)as userInfo
        
        if (!id) {
            res.json({ data: null, message: 'wrong accessToken' })
        } else {
            await getConnection()
                .createQueryBuilder()
                .delete()
                .from(User)
                .where("id = :id", { id: id })
                .execute();
            
            console.log('유저정보 삭제완료')
            res.status(200).json({ message: 'deleted and cookie destroyed' })
        }
    }else{
        res.json({ data: null, message: 'wrong accessToken' })
    }
}

export default leave;