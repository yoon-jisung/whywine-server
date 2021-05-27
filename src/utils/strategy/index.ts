import google from './google';
import kakao from './kakao';
import passport from 'passport';
import { createQueryBuilder } from "typeorm";
export default () => {
  //로그인 할 때 한 번 실행
    //로그인 할 때 한 번 실행
    passport.serializeUser((user: any, done) => {
      //serializeUser는 전달받은 객체를 세션에 저장하는 역할을 합니다.
      done(null, user.id);
    });
  
    //유저 관련에 매번 실행됨
    //이 deserializeUser는 서버로 들어오는 요청마다 세션 정보가 유효한지를 검사하는 역할을 합니다.
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
}