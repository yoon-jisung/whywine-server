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
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req: any, file: any, cb: any) {
      cb(null, Object.assign({}, req.body));
    },
    key: function (req: any, file: any, cb: any) {
      cb(null, "user/" + String(Date.now()));
    },
  }),
});

router.get("/", userinfo);
router.post("/nickname", nickname);
router.post("/password", password);
router.delete("/leave", leave);
router.post("/profileimage", upload.single("image"), profileImage.upload);

export default router;
