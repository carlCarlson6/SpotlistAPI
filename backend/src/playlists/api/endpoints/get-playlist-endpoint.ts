import { Domain } from "domain";
import { IRouter, query, Request, Response } from "express";
import { fail, ok, result, Result } from "typescript-monads";
import { DomainError } from "../../../common/domain-error";
import { Id } from "../../../common/id";
import { promiseResultError } from "../../../common/promise-result-error";
import { ExpressEndpoint } from "../../../infrastructure/express/express-endpoint";
import { getPlaylistById, GetPlaylistById } from "../../get-playlist";
import { Owner, Playlist, PlayListId } from "../../playlist";
import { PlaylistNotFound } from "../../playlist-not-found";
import { handleResultFromEndpoint } from "../handle-result-from-endpoint";
import { fromPlaylist } from "../models/songlist-dto";

export class GetPlaylistEndpoint implements ExpressEndpoint {
    constructor(
        private readonly router: IRouter
    ) { }
    
    declareEndpoint(): void {
        this.router.get(
            "/:listId",
            getPlaylistsEndpint(getPlaylistById));
    }
}

type GetPlaylistRequest = Request<{userId: string, playlistId: string}, {}, {}>;
type Endpoint = (request: GetPlaylistRequest, response: Response) => Promise<Response>;
type Query = { Owner: Owner, PlaylistId: PlayListId };

const getPlaylistsEndpint = (get: GetPlaylistById): Endpoint => (request: GetPlaylistRequest, response: Response) =>
    buildQuery(request)
        .map(isLogedUserAllowed(request)).unwrap()
        .match({
            ok: query => get(query.PlaylistId)
                .then(maybe => maybe.match({
                    some: playlist => ok<Playlist, DomainError>(playlist),
                    none: () => fail<Playlist, DomainError>(new PlaylistNotFound())
                })),
            fail: error => promiseResultError<Playlist>(error)
        })
        .then(result => handleResultFromEndpoint(response, result, fromPlaylist));

const buildQuery = (request: GetPlaylistRequest): Result<Query, DomainError> => 
    Id.create(request.params.userId)
        .map(userId => 
            Id.create(request.params.playlistId)
                .map(playlistId => 
                    ({
                        Owner: userId,
                        PlaylistId: playlistId
                    }))
        ).unwrap();

const isLogedUserAllowed = (request: GetPlaylistRequest): ((query: Query) => Result<Query, DomainError>) => {
    throw new Error("TODO - not implemented");
}