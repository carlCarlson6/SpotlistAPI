import { IRouter, Request, Response, Router } from "express";
import { ExpressEndpoints } from "../../infrastructure/express/express-endpoint";
import { ExpressRouter } from "../../infrastructure/express/express-router";
import { AddPlaylistEnpoint } from "./add-playlist-endpoint";

export class PlaylistRoutes implements ExpressRouter {
    router: IRouter = Router();
    path: string = "api/users/:userid/lists";
    
    endpoints: ExpressEndpoints = [
        new AddPlaylistEnpoint(this.router),
    ];

    declareRoutes(): void {
        console.log("building routes");
        this.endpoints.map(endpoint => endpoint.declareEndpoint())

        // TODO - move all as endpoint declaration
        this.router.get("/", this.getLists);
        this.router.get("/:listid", this.getList);
        this.router.post("/:listid/songs", this.postSong);
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

