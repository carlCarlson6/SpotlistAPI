import { none, some } from "typescript-monads";
import { Id } from "../../../src/common/id";
import { createServer } from "../../../src/infrastructure/express/run-express-server";
import { declareGetPlaylistEndpoint } from "../../../src/playlists/api/endpoints/get-playlist-endpoint";
import { playlistRoutes } from "../../../src/playlists/api/playlists-routes";
import { defaultExpressConfigurationReader } from "../../helpers/default-express-configuration-reader";
import { inMemoryAuthorizeMiddleware } from "../../helpers/inmemory-authorize-middleware";
import { userCarlKarlson as user } from "../../helpers/test-users";
import supertest from 'supertest'
import { buildAuthorizationHeader } from "../../helpers/build-authorization-header";
import { Playlist } from "../../../src/playlists/playlist";
import { Song } from "../../../src/playlists/song";
import { loggerMiddleware } from "../../../src/infrastructure/express/request-logger-middleware";

describe("given API with in memory database", () => {
    describe("given authorized user", () => {
        it("when GET /api/users/:userId/lists/:listId of an owned playlist then returns 200OK & playlist", done => {
            const playlistId = Id.createNew();
            const server = createServer(
                defaultExpressConfigurationReader,
                [
                    playlistRoutes([
                        declareGetPlaylistEndpoint(
                            (_: Id) => Promise.resolve(
                                some(Playlist.create(playlistId, user.id, [Song.create(Id.createNew(), "la cucaracha que canta", "la cucaracha")], new Date())))
                        )
                    ]),
                ],
                [ inMemoryAuthorizeMiddleware ]
            );
            
            supertest(server)
                .get(`/api/users/${user.id.toString()}/lists/${playlistId.toString()}`)
                .set(buildAuthorizationHeader(user.name, user.password))
                .expect(200)
                .end((error, response) => {
                    if (error) return done(error);
                    expect(response.body).toMatchObject({
                        listId: playlistId.toString(),
                        songs: [{
                            artist: "la cucaracha que canta",
                            title: "la cucaracha",
                        }],
                    });
                    return done()
                });
        });

        it("when GET /api/users/:userId/lists/:listId of a not owned playlist then returns 404 PlaylistNotFound", done => {
            const playlistId = Id.createNew();
            const server = createServer(
                defaultExpressConfigurationReader,
                [
                    playlistRoutes([
                        declareGetPlaylistEndpoint(
                            (_: Id) => Promise.resolve(some(Playlist.create(playlistId, Id.createNew(), [], new Date())))
                        )
                    ]),
                ],
                [ inMemoryAuthorizeMiddleware ]
            );
            
            supertest(server)
                .get(`/api/users/${user.id.toString()}/lists/${playlistId.toString()}`)
                .set(buildAuthorizationHeader(user.name, user.password))
                .expect(404)
                .end((error, response) => {
                    if (error) return done(error);
                    expect(response.body).toMatchObject({ message: "playlist not found" });
                    return done()
                });
        });

        describe("without playlists", () => {    
            it("when GET /api/users/:userId/lists/:listId then returns 404 PlaylistNotFound", done => {
                const server = createServer(
                    defaultExpressConfigurationReader,
                    [
                        playlistRoutes([
                            declareGetPlaylistEndpoint((_: Id) => Promise.resolve(none()))
                        ]),
                    ],
                    [ inMemoryAuthorizeMiddleware ]
                );

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

    describe("given unauthorized user", () => {
        const server = createServer(
            defaultExpressConfigurationReader,
            [],
            [ inMemoryAuthorizeMiddleware ]
        );

        it("with wrong password when GET /api/users/:userId/lists/:listId then returns 401 UnauthorizedUser", done => {
            supertest(server)
                .get(`/api/users/${user.id.toString()}/lists/${Id.createNew().toString()}`)
                .set(buildAuthorizationHeader(user.name, "a wrong password"))
                .expect(401)
                .end((error, response) => {
                    if (error) return done(error);
                    expect(response.body).toMatchObject({ message: "unauthorized user" });
                    return done()
                });
        });

        it("with wrong userName when GET /api/users/:userId/lists then returns 401 UnauthorizedUser", done => {
            supertest(server)
                .get(`/api/users/${user.id.toString()}/lists/${Id.createNew().toString()}`)
                .set(buildAuthorizationHeader("wrong userName", user.password))
                .expect(401)
                .end((error, response) => {
                    if (error) return done(error);
                    expect(response.body).toMatchObject({ message: "unauthorized user" });
                    return done()
                });
        });
    });
});