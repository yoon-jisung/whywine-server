import { Router, Request, Response, NextFunction } from "express";
import upload from "../utils/upload";

const router = Router();

router.post(
  "/upload",
  upload.single("img"),
  (req: Request, res: Response, next: NextFunction) => {
    console.log(req.file);
    res.json({ file: req.file });
  }
);

export default router;
