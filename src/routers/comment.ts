import { Router, Request, Response, NextFunction } from "express";
import upload from "../utils/upload";
import controller from "../controllers/comment";

const router = Router();

router.post("/good", (req: Request, res: Response) => {
  controller.good(req, res);
});

router.post("/bad", (req: Request, res: Response) => {
  controller.bad(req, res);
});

export default router;
