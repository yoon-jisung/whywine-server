import { Request, Response, NextFunction} from 'express';
import { createQueryBuilder } from "typeorm";
import * as bcrypt from 'bcrypt';
import { User } from "../../entity/user";

const leave = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await createQueryBuilder("user")
            .where("id = :id", { id: req.session!.passport!.user })
            .execute();
        if (user.length !== 0) {
                let result: boolean = false;
            try {
                result = await bcrypt.compare(req.body.password, user[0].User_password);
            } catch (e) {
                return res.status(400).send({
                    data: null,
                    message: 'deleted'
                })
            }
            if (result) {
                await createQueryBuilder("user")
                    .delete()
                    .from(User)
                    .where({ id: req.session!.passport!.user })
                    .execute();
                console.log(`탈퇴한 회원입니다: ${req.session!.passport!.user}`);
                req.logout();;
                if (req.session) {
                req.session.destroy((err) => {
                    res.clearCookie('connect.sid');
                    return res.status(200).send({ data: null, message: "ok" });
                });
                } else {
                    return res.status(200).send({ data: null, message: "ok" });
                }
            } else {
                return res.status(400).send({
                    data: null,
                    message: "wrong password"
                    })
            }
        }
    } catch (error) {
        console.error(error.message);
        res.status(401).send({ data: null, message: "not authorized" });
    }
}

export default leave;