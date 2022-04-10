import { NextFunction, Request, Response } from "express";
import { ExpressMiddleware } from "./express-middleware";

export const loggerMiddleware: ExpressMiddleware = (request: Request, response: Response, next: NextFunction) => {
    console.log(`${request.method} ${request.path}`);
    next();
    return Promise.resolve();
}