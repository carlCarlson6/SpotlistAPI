import { IRouter, Request, Response } from "express";
import { Result, ok, fail } from "typescript-monads";
import { DomainError } from "../../../common/domain-error";
import { Id } from "../../../common/id";
import { promiseResultError } from "../../../common/promise-result-error";
import { UnauthorizedOperation } from "../../../common/unauthorized-operation";
import { ExpressEndpoint } from "../../../infrastructure/express/express-endpoint";
import { addSongToPlaylist, AddSongToPlaylist, AddSongToPlaylistCommand } from "../../add-song-to-playlist";
import { getPlaylistById } from "../../get-playlist";
import { Playlist } from "../../playlist";
import { mongoUpdatePlaylist } from "../../store-playlist";
import { handleResultFromEndpoint } from "../handle-result-from-endpoint";
import { SongDto } from "../models/song-dto";

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

type AddSongToPlayListRequest = Request<{userId: string, listId: string}, {}, SongDto>
type Endpoint = (request: AddSongToPlayListRequest, response: Response) => Promise<Response>

const addSongtoPlaylistEndpoint = (addSongToPlaylist: AddSongToPlaylist): Endpoint => (request: AddSongToPlayListRequest, response: Response) => 
    buildCommand(request)
        .flatMap(isCurrentUserOwner(request))
        .match({
            ok: addSongToPlaylist,
            fail: error => promiseResultError<Playlist>(error)
        })
        .then(result => handleResultFromEndpoint(response, result));

const buildCommand = (request: AddSongToPlayListRequest): Result<AddSongToPlaylistCommand, DomainError> =>
    Id.create(request.params.listId).map(id => ({
        ListId: id,
        Song: request.body,
    }));

const isCurrentUserOwner = (request: AddSongToPlayListRequest): ((command: AddSongToPlaylistCommand) => Result<AddSongToPlaylistCommand, DomainError>) =>  command => 
    Id.create(request.params.userId)
        .map(userId => userId.toString() === request.currentUser.id.toString())
        .flatMap(isSameId => isSameId ? ok<AddSongToPlaylistCommand, DomainError>(command) : fail<AddSongToPlaylistCommand, DomainError>(new UnauthorizedOperation()));
