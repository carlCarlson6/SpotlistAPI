import { IRouter, Request, Response } from "express";
import { ExpressEndpoint } from "../../infrastructure/express/express-endpoint";
import { addSongToPlaylist, AddSongToPlaylist } from "../add-song-to-playlist";
import { getPlaylistById } from "../get-playlist";
import { mongoUpdatePlaylist } from "../store-playlist";
import { Song as SongDto } from "./api-models";

export class AddSongtoPlaylistEndpoint implements ExpressEndpoint {
    constructor(
        private readonly router: IRouter
    ) { }
    
    declareEndpoint(): void {
        this.router.post(
            "/:listId/songs", 
            addSongtoPlaylistEndpoint(addSongToPlaylist({
                storePlaylist: mongoUpdatePlaylist,
                getPlaylist: getPlaylistById
            }))
        );
    }
}

type AddSongToPlayListRequest = Request<{userId: string}, {}, SongDto>
type Endpoint = (request: AddSongToPlayListRequest, response: Response) => Promise<Response>

const addSongtoPlaylistEndpoint = (addSongToPlaylist: AddSongToPlaylist): Endpoint => {
    throw new Error("TODO - not implemented");
}