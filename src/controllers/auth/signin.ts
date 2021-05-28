import { Request, Response, NextFunction} from 'express';
import dotenv from 'dotenv';
import passport from 'passport';
dotenv.config();

const signin = async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error(err);
            return next(err);
        }
        if (info) {
            return res.status(401).send(info);
        }
        return req.login(user, async (loginErr) => {
            try {
                if (loginErr) {
                    console.error(loginErr);
                    return next(loginErr);
                }
            return res.send({ data: { id: user.User_id, email: user.User_email }, message: "login success" });
            } catch (e) {
                return next(e);
            }
        });
    })(req, res, next)
}

export default signin;