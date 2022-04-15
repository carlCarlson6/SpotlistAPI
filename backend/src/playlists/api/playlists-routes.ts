import { IRouter, Router } from "express";
import { ExpressEndpoints } from "../../infrastructure/express/express-endpoint";
import { ExpressRouter } from "../../infrastructure/express/express-router";
import { AddPlaylistEnpoint } from "./endpoints/add-playlist-endpoint";
import { AddSongtoPlaylistEndpoint } from "./endpoints/add-song-to-playlist-endpoint";
import { GetPlaylistEndpoint } from "./endpoints/get-playlist-endpoint";
import { GetPlaylistsEndpoint } from "./endpoints/get-playlists-endpoint";

class PlaylistRoutes implements ExpressRouter {
    router: IRouter = Router();
    path: string = "api/users/:userId/lists";
    
    endpoints: ExpressEndpoints = [
        new AddPlaylistEnpoint(this.router),
        new AddSongtoPlaylistEndpoint(this.router),
        new GetPlaylistEndpoint(this.router),
        new GetPlaylistsEndpoint(this.router),
    ];

    declareRoutes(): ExpressRouter {
        console.log("building routes");
        this.endpoints.map(endpoint => endpoint.declareEndpoint());
        return this;
    }
}

export const playlistRoutes = () => new PlaylistRoutes().declareRoutes();
