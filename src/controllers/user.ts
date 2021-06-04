import { Request, Response } from "express";
import { getConnection } from "typeorm";
import { Tag } from "../entity/tag";
import { User } from "../entity/user";
import { Wine } from "../entity/wine";
require("dotenv").config();

export = {
  update: async (req: Request, res: Response) => {
    try {
      const connection = await getConnection();
      let tags: string[] = [];

      let userId: number;

      if (req.session!.passport!) {
        userId = req.session!.passport!.user;
      } else {
        throw new Error("userId");
      }

      if (req.body.tags !== undefined && req.body.tags.length !== 0) {
        tags = req.body.tags;
      } else {
        throw new Error("tags");
      }

      let userRepo = connection.getRepository(User); // user table
      let tagRepo = connection.getRepository(Tag); // tag table
      const user = await userRepo.findOne({
        where: { id: userId },
        relations: ["tags"],
      });

      if (user) {
        let tagsArr: Tag[] = [];
        for (let tag of tags) {
          const one = await tagRepo.findOne({ name: tag });
          if (one !== undefined) {
            tagsArr.push(one);
          }
        }

        for (let tag of user.tags) {
          await connection
            .createQueryBuilder()
            .relation(User, "tags")
            .of(user)
            .remove(tag);
        }
        await connection
          .createQueryBuilder()
          .relation(User, "tags")
          .of(user)
          .add(tagsArr);

        res.status(200).send({ message: "ok." });
      } else {
        throw new Error("user");
      }
    } catch (e) {
      if (e.message === "userId") {
        res.status(401).send({ message: "userId not existed" });
      } else if (e.message === "tags") {
        res.status(204).send({ message: "tags not found" }); // 아무런 태그를 선택하지 않은 경우
      } else if (e.messageb === "user") {
        res.status(401).send({ message: "user not existed" });
      }
    }
  },
  like: async (req: Request, res: Response) => {
    try {
      let wineId: number;
      let userId: number;

      if (req.session!.passport!) {
        userId = req.session!.passport!.user;
      } else {
        throw new Error("userId");
      }
      if (req.body.wineId) {
        wineId = req.body.wineId;
      } else {
        throw new Error("wineId");
      }

      const connection = await getConnection(); // 데이터베이스와 연결
      const wineRepo = await connection.getRepository(Wine);
      const userRepo = await connection.getRepository(User);

      const wine: Wine | undefined = await wineRepo.findOne({ id: wineId });
      const user: User | undefined = await userRepo.findOne({
        where: { id: userId },
        relations: ["wines"],
      }); // 2=>userId
      if (wine && user) {
        if (user.wines.findIndex((wine) => wine.id === wineId) !== -1) {
          throw new Error("already liked");
        }
        await wineRepo
          .createQueryBuilder()
          .update(Wine)
          .set({ likeCount: () => "likeCount+1" })
          .where("id = :wineId", { wineId })
          .execute();
        await connection
          .createQueryBuilder()
          .relation(User, "wines")
          .of(user)
          .add(wine);
        res.status(200).send({ message: "ok" });
      } else if (!user) {
        throw new Error("user");
      } else if (!wine) {
        throw new Error("wine");
      }
    } catch (e) {
      if (e.message === "userId") {
        res.status(401).send({ message: "you are unauthorized" });
      } else if (e.message === "wineId") {
        res.status(404).send({ message: "wineId not existed" });
      } else if (e.message === "user") {
        res.status(404).send({ message: "user not existed" });
      } else if (e.message === "wine") {
        res.status(404).send({ message: "wine not existed" });
      } else if (e.message === "already liked") {
        res.status(404).send({ message: "이미 좋아요 누름" });
      }
    }
  },
  unlike: async (req: Request, res: Response) => {
    try {
      let wineId: number;
      let userId: number;

      if (req.session!.passport!) {
        userId = req.session!.passport!.user;
      } else {
        throw new Error("userId");
      }
      if (req.body.wineId) {
        wineId = req.body.wineId;
      } else {
        throw new Error("wineId");
      }

      const connection = await getConnection(); // 데이터베이스와 연결
      const wineRepo = await connection.getRepository(Wine);
      const userRepo = await connection.getRepository(User);

      const wine: Wine | undefined = await wineRepo.findOne({ id: wineId });
      const user: User | undefined = await userRepo.findOne({
        where: { id: userId },
        relations: ["wines"],
      }); // 2=>userId
      if (wine && user) {
        let wineids = user.wines.findIndex((wine) => wine.id === wineId);
        if (wineids === -1) {
          throw new Error("not in wines");
        }
        await connection
          .createQueryBuilder()
          .relation(User, "wines")
          .of(user)
          .remove(wineId);

        await connection
          .createQueryBuilder()
          .update(Wine)
          .set({ likeCount: () => "likeCount-1" })
          .where("id = :wineId", { wineId })
          .execute();
        res.status(200).send({ message: "ok" });
      } else if (!user) {
        throw new Error("user");
      } else if (!wine) {
        throw new Error("wine");
      }
    } catch (e) {
      if (e.message === "userId") {
        res.status(401).send({ message: "you are unauthorized" });
      } else if (e.message === "wineId") {
        res.status(404).send({ message: "wineId not existed" });
      } else if (e.message === "user") {
        res.status(404).send({ message: "user not existed" });
      } else if (e.message === "wine") {
        res.status(404).send({ message: "wine not existed" });
      } else if (e.message === "not in wines") {
        res.status(404).send({ message: "안찜한 와인을 취소하고 있어용" });
      }
    }
  },
};
