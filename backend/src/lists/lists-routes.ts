import { IRouter, Request, Response, Router } from "express";
import { ExpressRouter } from "../infrastructure/express/express-router";

export class ListsRoutes implements ExpressRouter {
    router: IRouter = Router();
    path: string = "api/users/:userid/lists";
    
    declareRoutes(): void {
        console.log("building routes");
        this.router.post("/", this.postList);
        this.router.get("/", this.getLists);
        this.router.get("/:listid", this.getList);
        this.router.post("/:listid/songs", this.postSong);
    }
    
    postList(request: Request, response: Response): void { 
        throw new Error("Method not implemented.");
    }

    getLists(request: Request, response: Response): void {
        throw new Error("Method not implemented.");
    }

    getList(request: Request, response: Response): void {
        throw new Error("Method not implemented.");
    }

    postSong(request: Request, response: Response): void {
        throw new Error("Method not implemented.");
    }
}