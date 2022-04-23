import { IRouter, Request, Response } from "express";
import { fail, ok, Result } from "typescript-monads";
import { DomainError } from "../../../common/domain-error";
import { Id } from "../../../common/id";
import { promiseResultError } from "../../../common/promise-result-error";
import { UnauthorizedOperation } from "../../../common/unauthorized-operation";
import { ExpressEndpointDeclaration } from "../../../infrastructure/express/express-endpoint";
import { GetPlaylistById, GetPlaylistQuery } from "../../get-playlist";
import { isPlaylistOwnedByUser, playlistNotFoundFail } from "../../is-playlist-owned-by-user";
import { Playlist } from "../../playlist";
import { handleResultFromEndpoint } from "../handle-result-from-endpoint";
import { fromPlaylist } from "../models/songlist-dto";

export const declareGetPlaylistEndpoint = (get: GetPlaylistById): ExpressEndpointDeclaration => 
    (router: IRouter) => router.get(
        "/:userId/lists/:listId",
        getPlaylistsEndpoint(get)
    );

type GetPlaylistRequest = Request<{userId: string, listId: string}, {}, {}>;
type Endpoint = (request: GetPlaylistRequest, response: Response) => Promise<Response>;

const getPlaylistsEndpoint = (get: GetPlaylistById): Endpoint => (request: GetPlaylistRequest, response: Response) =>
    buildQuery(request)
        .map(isLogedUserAllowed(request)).unwrap()
        .match({
            ok: query => get(query.PlaylistId)
                .then(maybe => maybe.match({
                    some: isPlaylistOwnedByUser(query.Owner),
                    none: playlistNotFoundFail
                })),
            fail: error => promiseResultError<Playlist>(error)
        })
        .then(result => handleResultFromEndpoint(response, result, fromPlaylist));

const buildQuery = (request: GetPlaylistRequest): Result<GetPlaylistQuery, DomainError> => 
    Id.parse(request.params.userId)
        .map(userId => 
            Id.parse(request.params.listId)
                .map(playlistId => 
                    ({
                        Owner: userId,
                        PlaylistId: playlistId
                    }))
        ).unwrap();

const isLogedUserAllowed = (request: GetPlaylistRequest): ((query: GetPlaylistQuery) => Result<GetPlaylistQuery, DomainError>) => 
    query => query.Owner.toString() === request.currentUser.id.toString() ? ok(query) : fail(new UnauthorizedOperation());

       