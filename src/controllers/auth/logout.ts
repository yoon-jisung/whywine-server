import { Router, Request, Response, NextFunction } from "express";

const logout = async (req: Request, res: Response) => {
    console.log("로그 아웃");
    req.logout();
    if (req.session) {
    req.session.destroy((err) => {
        res.clearCookie('connect.sid');
        res.send({ data: null, message: 'logout success' });
    });
    } else {
        res.send({ data: null, message: 'logout success' });
    }
}

export default logout;