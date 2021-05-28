import { Request, Response, NextFunction} from 'express';
import * as bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { createQueryBuilder } from "typeorm";
import { User } from "../../entity/user";

dotenv.config();

const password = async (req: Request, res: Response, next: NextFunction) => {
    const { oldPassword, newPassword } = req.body
    try {
        const user = await createQueryBuilder("user")
            .where("id = :id", { id: req.session!.passport!.user })
            .execute();
        if (user.length !== 0) {
            if (newPassword !== '') {
                const hashedPassword = await bcrypt.hash(newPassword, 10);
                if(oldPassword === hashedPassword){
                    await createQueryBuilder("user")
                        .update(User)
                        .set({ password: hashedPassword })
                        .where({ id: req.session!.passport!.user })
                        .execute();
                    return res.status(200).send({ data: null, message: "edit success" });
                }
                return res.status(400).send({ data: null, message: "이전 비밀번호가 일치하지 않습니다" });
            } else {
                return res.status(400).send({ data: null, message: "비밀번호가 비어있습니다" });
            }
        }
    } catch (error) {
        console.error(error.message);
            res.status(401).send({ data: null, message: "not authorized" });
    };
}

export default password;