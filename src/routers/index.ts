import { Router, Request, Response, NextFunction } from "express";
const router = Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("hello typescript express!");
});

export default router;
