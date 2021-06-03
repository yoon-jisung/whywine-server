import { Router, Request, Response, NextFunction } from "express";
import dotenv from 'dotenv'
dotenv.config()
const client = process.env.client || 'https://localhost:3000'


const sociallogin = async (req: Request, res: Response) => {
    res.redirect(`${client}`+"/main")
}

export default sociallogin;