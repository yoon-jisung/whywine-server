import { Router, Request, Response, NextFunction } from "express";
const express = require("express");
const router = express.Router();
const multer = require("multer");
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");
const {
  userinfo,
  nickname,
  password,
  leave,
  profileImage,
} = require("../controllers/userinfo");
require("dotenv").config();

AWS.config.update({
  // aws 설정
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: "us-east-2",
});
const s3 = new AWS.S3();
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "whywine-image",
    metadata: function (req: any, file: any, cb: any) {
      // s3에 넘길 metadata object
      cb(null, {
        fieldName: file.fieldname,
        ContentType: "image/" + file.originalname.split(".")[1],
      });
    },
    key: function (req: any, file: any, cb: any) {
      // 파일 이름
      cb(null, "user/" + file.originalname);
    },
  }),
});

router.get("/", userinfo);
router.post("/nickname", nickname);
router.post("/password", password);
router.delete("/leave", leave);
router.get("/upload", upload.single("img"), profileImage.upload);

export default router;
