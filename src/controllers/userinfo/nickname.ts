import { Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { getRepository, getConnection } from "typeorm";
import { Tag } from "../../entity/tag";
import { User } from "../../entity/user";
import { Comment } from "../../entity/comment";
import { Wine } from "../../entity/wine";
const userRepository = getRepository(User);
dotenv.config();

const nickname = async (req: Request, res: Response, next: NextFunction) => {
    const {newNickname, accessToken} = req.body
    interface userInfo {
        id: number;
        email: string;
        nickname: string;
        likes?: number;
        image?: Buffer;
        tags: Tag[];
        good?: Comment[];
        bad?: Comment[];
        wines?: Wine[];
    }
    if(!accessToken){
        return res
            .status(401)
            .json({ message: 'wrong accessToken' })
    }
    const {id, nickname} = jwt.verify(accessToken,process.env.ACCTOKEN_SECRET!)as userInfo
    if(nickname === newNickname){
        return res
            .status(401)
            .json({ message: 'same nickname' })
    }
    if(newNickname===''){
        return res
            .status(401)
            .json({ message: 'new nickname is empty' })
    }
    await getConnection()
        .createQueryBuilder()
        .update(User)
        .set({ 
            nickname: nickname
        })
        .where("id = :id", { id: id })
        .execute();
    const userInfo = await userRepository.findOne({
        where: { id : id }
    })
    return res
        .status(200)
        .json({ data : userInfo, message : 'ok.' })
}

export default nickname;