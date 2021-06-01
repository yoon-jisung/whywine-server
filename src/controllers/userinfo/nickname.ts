import { Request, Response, NextFunction} from 'express';
import * as bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { createQueryBuilder } from "typeorm";
import { User } from "../../entity/user";


dotenv.config();

const nickname = async (req: Request, res: Response, next: NextFunction) => {
    const { newNickname } = req.body
    try {
        const user = await createQueryBuilder("user")
            .where("id = :id", { id: req.session!.passport!.user })
            .execute();
        if (user.length !== 0) {
            if (newNickname !== user[0].nickname && newNickname !== '') {
            await createQueryBuilder("user")
                .update(User)
                .set({ nickname: newNickname })
                .where({ id: req.session!.passport!.user })
                .execute();
                return res.status(200).send({ data: null, message: "ok" });
            }
            if(newNickname === ''){
                return res.status(400).send({ data: null, message: "바꿀 닉네임이 없습니다" });
            } 
            return res.status(400).send({ data: null, message: "이전 닉네임과 같습니다" });
        }
    } catch (error) {
        console.error(error.message);
            res.status(401).send({ data: null, message: "not authorized" });
    };
}

export default nickname;