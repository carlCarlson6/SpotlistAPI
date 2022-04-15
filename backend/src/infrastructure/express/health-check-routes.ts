import { Request, Response, Router } from "express";
import { ExpressRouter } from "./express-router";

class HealthCheckRoutes implements ExpressRouter {
    public router = Router();
    public path = "/api/health";

    declareRoutes(): ExpressRouter {
        this.router.get("/", this.get);
        this.router.get("/:message", this.getMessage);
        return this;
    }

    get(_: Request, response: Response): void {
        response.status(200).send("hello world! :)")
    }

    getMessage(request: Request, response: Response): void {
        response.status(200).send(request.params.message)
    }
}

export const healthCheckRoutes = () => new HealthCheckRoutes().declareRoutes();