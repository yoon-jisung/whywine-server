import { Router, Request, Response, NextFunction } from "express";
import controller from "../controllers/main";
const router = Router();

router.post("/tags", (req: Request, res: Response, next: NextFunction) => {
  controller.tags(req, res);
});

router.get("/search", (req: Request, res: Response) => {
  controller.search(req, res);
});

export default router;
