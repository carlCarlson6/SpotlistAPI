import { Express, Request, Response, Router } from "express";
import { ExpressRouter } from "./express-router";

const healthUri = "/api/health";

const getHealth = (_: Request, response: Response) => 
    response
        .status(200)
        .send("hello world! :)");

const getHealthWithMessage = (request: Request, response: Response) => 
    response
        .status(200)
        .send(request.params.message);

export const healthCheckRoutes: ExpressRouter = (expressApp: Express) => {
    const router = Router();

    router.get("/", getHealth);
    router.get("/:message", getHealthWithMessage);

    return expressApp.use(healthUri, router);
};