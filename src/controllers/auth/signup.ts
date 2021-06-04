import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { createQueryBuilder } from "typeorm";
import { User } from "../../entity/user";

dotenv.config();

const signup = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.email || req.body.email === "") {
    res.status(400).send({ message: "email not existed." });
    return;
  }
  if (!req.body.nickname || req.body.nickname === "") {
    res.status(400).send({ message: "nickname not existed." });
    return;
  }
  if (!req.body.password || req.body.password === "") {
    res.status(400).send({ message: "password not existed." });
    return;
  }
  try {
    const exUser = await createQueryBuilder("user")
      .where("email = :email", { email: req.body.email })
      .execute();
    console.log(exUser);
    if (exUser.length !== 0) {
      console.log("이미 사용중인 아이디로 회원가입 시도 탐지");
      return res
        .status(403)
        .send({ data: null, message: "이미 사용중인 아이디입니다." });
      return;
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = await createQueryBuilder("user")
      .insert()
      .into(User)
      .values([
        {
          email: req.body.email,
          nickname: req.body.nickname,
          password: hashedPassword,
          likes: 0,
        },
      ])
      .execute();

    console.log(
      `회원가입 신청내역입니다 : email: ${req.body.email}, name: ${req.body.name}, password(암호화됨): ${hashedPassword}`
    );

    return res.status(200).send({
      data: null,
      message: `signup success`,
    });
  } catch (error) {
    console.error(error.message);
    if (error.message === "Cannot read property 'user' of undefined") {
      res.status(401).send({ data: null, message: "not authorized" });
    } else {
      res.status(400).send({ data: null, message: error.message });
    }
  }
};
export default signup;
