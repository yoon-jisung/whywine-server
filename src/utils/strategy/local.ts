import passport from 'passport';
import bcrypt from 'bcrypt';
import { Strategy } from 'passport-local';
import { createQueryBuilder } from "typeorm";

export default () => {
    passport.use('local', new Strategy({
        usernameField: 'email',
        passwordField: 'password',
    }, async (email, password, done) => {
        try {
            const user = (await createQueryBuilder("user")
                .where("email = :email", { email })
                .execute())[0];
            if (!user || user.length === 0) {
            return done(null, false, { message: 'email address not exist' });
        }
        const result = await bcrypt.compare(password, user.User_password);
        if (result) {
            return done(null, user);
        }
        return done(null, false, { message: 'wrong password' });
        } catch (e) {
            console.error(e);
            return done(e);
        }
    }));
};