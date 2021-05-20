import AWS from "aws-sdk";
import multer from "multer";
import multerS3 from "multer-s3";
import path from "path";

/* 이미지 서버 설정 */
AWS.config.update({
  // aws 설정
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: "us-east-2",
});

const upload = multer({
  storage: multerS3({
    s3: new AWS.S3(),
    bucket: "whywine-image",
    key(req, file, cb): void {
      cb(null, `${path.basename(file.originalname)}`);
    },
  }),
});

export = upload;
