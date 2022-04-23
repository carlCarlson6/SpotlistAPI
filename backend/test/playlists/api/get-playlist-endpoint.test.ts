import { none } from "typescript-monads";
import { Id } from "../../../src/common/id";
import { createServer } from "../../../src/infrastructure/express/run-express-server";
import { declareGetPlaylistEndpoint } from "../../../src/playlists/api/endpoints/get-playlist-endpoint";
import { playlistRoutes } from "../../../src/playlists/api/playlists-routes";
import { defaultExpressConfigurationReader } from "../../helpers/default-express-configuration-reader";
import { inMemoryAuthorizeMiddleware } from "../../helpers/inmemory-authorize-middleware";
import { userCarlKarlson as user } from "../../helpers/test-users";
import supertest from 'supertest'
import { buildAuthorizationHeader } from "../../helpers/build-authorization-header";

describe("given API with in memory database", () => {
    describe("given authorized user without playlists", () => {
        const server = createServer(
            defaultExpressConfigurationReader,
            [
                playlistRoutes([
                    declareGetPlaylistEndpoint((_: Id) => Promise.resolve(none()))
                ]),
            ],
            [ inMemoryAuthorizeMiddleware ]
        );

        it("when GET /api/users/:userId/lists/:listId then return 404 PlaylistNotFound", done => {
            supertest(server)
                .get(`/api/users/${user.id.toString()}/lists/${Id.createNew().toString()}`)
                .set(buildAuthorizationHeader(user.name, user.password))
                .expect(404)
                .end((error, response) => {
                    if (error) return done(error);
                    expect(response.body).toMatchObject({ message: "playlist not found" });
                    return done()
                });
        });
    });
});