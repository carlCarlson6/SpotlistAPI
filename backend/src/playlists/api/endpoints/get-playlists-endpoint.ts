import { IRouter, Request, Response } from "express";
import { fail, ok, Result } from "typescript-monads";
import { DomainError } from "../../../common/domain-error";
import { Id } from "../../../common/id";
import { promiseResultError } from "../../../common/promise-result-error";
import { UnauthorizedOperation } from "../../../common/unauthorized-operation";
import { ExpressEndpoint } from "../../../infrastructure/express/express-endpoint";
import { getUserPlaylists, GetUserPlaylists } from "../../get-playlist";
import { Owner, Playlists } from "../../playlist";
import { handleResultFromEndpoint } from "../handle-result-from-endpoint";
import { fromPlaylist } from "../models/songlist-dto";

export class GetPlaylistsEndpoint implements ExpressEndpoint {
    constructor(
        private readonly router: IRouter
    ) { }
    
    declareEndpoint(): void {
        this.router.get(
            "/", 
            getPlaylistsEndpoint(getUserPlaylists));
    }
}

type GetPlaylistsRequest = Request<{userId: string}, {}, {}>;
type Endpoint = (request: GetPlaylistsRequest, response: Response) => Promise<Response>;

const getPlaylistsEndpoint = (get: GetUserPlaylists): Endpoint => (request: GetPlaylistsRequest, response: Response) => 
    buildQuery(request)
        .flatMap(isCurrentUserOwner(request))
        .match({
            ok: ownerId => get(ownerId).then(playlists => ok<Playlists, DomainError>(playlists)),
            fail: error => promiseResultError<Playlists>(error)
        })
        .then(result => handleResultFromEndpoint(response, result, (playlists: Playlists) => playlists.map(fromPlaylist)));

const buildQuery = (request: GetPlaylistsRequest): Result<Owner, DomainError> => 
        Id.create(request.params.userId);

const isCurrentUserOwner = (request: GetPlaylistsRequest): ((owner: Owner) => Result<Owner, DomainError>) => (owner: Owner) => 
        owner.toString() === request.currentUser.id.toString()
            ? ok(owner)
            : fail(new UnauthorizedOperation(""));