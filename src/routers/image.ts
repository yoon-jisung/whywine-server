import { Router, Request, Response, NextFunction } from "express";
import upload from "../utils/upload";
import controller from "../controllers/sync";

const router = Router();

/* router.post(
  // 새로운 사진을 한 장 업로드
  "/upload",
  upload.single("img"),
  (req: Request, res: Response, next: NextFunction) => {
    console.log(req.file);
    res.json({ file: req.file });
  }
); */
router.get("/sync", (req: Request, res: Response, next: NextFunction) => {
  controller.sync(req, res);
}); // wineData의 파일을 업로드
export = router;
