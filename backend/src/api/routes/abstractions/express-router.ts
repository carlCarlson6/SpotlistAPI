import { IRouter } from "express";

export interface ExpressRouter {
    router: IRouter;
    path: string;
    declareRoutes(): void;
}