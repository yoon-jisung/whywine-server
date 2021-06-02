import { Request, Response, NextFunction } from "express";

import dotenv from "dotenv";
import { getConnection } from "typeorm";
import { User } from "../../entity/user";
import user from "../user";
const AWS = require("aws-sdk");
dotenv.config();
AWS.config.update({
  // aws 설정
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: "us-east-2",
});
const s3 = new AWS.S3();

interface fileInterface {
  fieldname?: string;
  originalname?: string;
  encoding?: string;
  mimetype?: string;
  size?: number;
  bucket?: string;
  key?: string;
  acl?: string;
  contentType?: string;
  storageClass?: string;
  metadata?: {};
  location?: string;
  etag?: string;
}
const profileImage = {
  upload: async (req: Request, res: Response) => {
    try {
      let userId: number;
      if (req.session!.passport !== undefined) {
        userId = req.session.passport.user;
      } else {
        throw new Error("userId");
      }
      const fileObj: fileInterface = req.file;

      if (!fileObj || !fileObj.key) {
        throw new Error("upload");
      }

      const connection = await getConnection();
      const userRepo = await connection.getRepository(User);

      let user = await userRepo.findOne({ where: { id: userId } }); // 2 => userId
      if (user) {
      } else {
        throw new Error("user");
      }
      if (user.image) {
        await s3.deleteObject(
          {
            Bucket: "whywine-image",
            Key: "user/" + user.image,
          },
          (err: any, data: any) => {
            if (err) {
              throw new Error("delete old");
            }
          }
        );
      }
      await connection
        .createQueryBuilder()
        .update(User)
        .set({ image: fileObj.key.split("/")[1] })
        .where("id = :userId", { userId })
        .execute();
      const updatedUser = await userRepo.findOne({
        select: ["id", "email", "likes", "image", "nickname"],
        where: { id: userId },
      });
      res.status(200).send({ message: "ok", data: { user: updatedUser } });
    } catch (e) {
      if (e.message === "userId") {
        res.status(401).send({ message: "You are unauthorized." });
      } else if (e.message === "user") {
        res.status(401).send({ message: "user not existed" });
      } else if (e.message === "upload") {
        res.status(500).send({ message: "upload failed" });
      } else if (e.message === "delete old") {
        res.status(500).send({ message: "failed to delete old image" });
      }
    }
  },
};

export default profileImage;
