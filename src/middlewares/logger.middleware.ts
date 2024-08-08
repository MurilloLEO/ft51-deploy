import { NextFunction, Request, Response } from "express";

export function LoggerMiddleware(req: Request, res: Response , next: NextFunction) {

    const actualDate = new Date();
    const date = actualDate.toLocaleDateString();
    const time = actualDate.toLocaleTimeString();
    const metodo = req.method;
    const url = req.url;
    const ip = req.ip.includes('::ffff:')? req.ip.split('::ffff:')[1]: req.ip;

    // console.log(`[${date} - ${time}] ${metodo} ${url} - IP: ${ip}`);

    next();
    
}