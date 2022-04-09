import { IRouter, Request, Response, Router } from "express";
import { ExpressEndpoints } from "../../infrastructure/express/express-endpoint";
import { ExpressRouter } from "../../infrastructure/express/express-router";
import { AddPlaylistEnpoint } from "./add-playlist-endpoint";
import { GetPlaylistEndpoint } from "./get-playlist-endpoint";
import { GetPlaylistsEndpoint } from "./get-playlists-endpoint";

export class PlaylistRoutes implements ExpressRouter {
    router: IRouter = Router();
    path: string = "api/users/:userId/lists";
    
    endpoints: ExpressEndpoints = [
        new AddPlaylistEnpoint(this.router),
        new GetPlaylistsEndpoint(this.router),
        new GetPlaylistEndpoint(this.router),
    ];

    declareRoutes(): void {
        console.log("building routes");
        this.endpoints.map(endpoint => endpoint.declareEndpoint())
    }
}