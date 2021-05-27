import passport from 'passport';
import { createQueryBuilder } from "typeorm";
import google from './google';
import kakao from './kakao';
import local from './local';

export default () => {

    passport.serializeUser((user: any, done) => {
      done(null, user.User_id);
    });

    passport.deserializeUser(async (id: number, done) => {
      try {
        const user = await createQueryBuilder("user")
          .where("id = :id", { id })
          .execute();
        return done(null, user); //이것이 req.user가 되는데 따로 타이핑을 해줘야 함.
      } catch (err) {
        console.error(err);
        return done(err);
      }
    });
    google();
    kakao();
    local();
}