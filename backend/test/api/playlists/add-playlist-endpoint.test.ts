import supertest from 'supertest'
import { ok } from 'typescript-monads';
import { Id } from '../../../src/common/id';
import { createServer } from "../../../src/infrastructure/express/run-express-server";
import { AddListToUserCommand } from '../../../src/playlists/add-playlist';
import { declareAddPlaylistEndpoint } from '../../../src/playlists/api/endpoints/add-playlist-endpoint';
import { SongsDtos } from '../../../src/playlists/api/models/song-dto';
import { playlistRoutes } from '../../../src/playlists/api/playlists-routes';
import { Playlist } from '../../../src/playlists/playlist';
import { Song } from '../../../src/playlists/song';
import { buildAuthorizationHeader } from '../helpers/build-authorization-header';
import { defaultExpressConfigurationReader } from "../helpers/default-express-configuration-reader";
import { inMemoryAuthorizeMiddleware } from "../helpers/inmemory-authorize-middleware";
import { userCarlKarlson as user } from "../helpers/test-users";

describe("given API with in memory database", () => {
    describe("given authorized user", () => {
        it("when POST /api/users/:userId/lists then returns 200OK & the created list", done => {
            const songsDtos: SongsDtos = [
                { artist: "queen", title: "another one byte the dust" },
                { artist: "la cucaracha que canta", title: "la cucaracha" },
            ];
            const server = createServer(
                defaultExpressConfigurationReader, 
                [
                    playlistRoutes([
                        declareAddPlaylistEndpoint(
                            (_: AddListToUserCommand) => 
                                Promise.resolve(ok(Playlist.createNew(
                                    user.id,
                                    songsDtos.map(songDto => Song.create(Id.createNew(), songDto.artist, songDto.title)),
                                )))
                        )
                    ]),
                ],
                [inMemoryAuthorizeMiddleware]
            );

            supertest(server)
                .post(`/api/users/${user.id.toString()}/lists`)
                .set(buildAuthorizationHeader(user.name, user.password))
                .set('Accept', 'application/json')
                .send({ songs: songsDtos })
                .expect(200)
                .end((error, response) => {
                    if (error) return done(error);
                    console.log(response.body);
                    expect(response.body.songs).toMatchObject(songsDtos);
                    return done()
                });
        });
    });

    describe("given unauthorized user", () => {
        const server = createServer(defaultExpressConfigurationReader, [], [inMemoryAuthorizeMiddleware]);
        const songs: SongsDtos = [];

        it("with wrong password when POST /api/users/:userId/lists then returns 401 UnauthorizedUser", done => {
            supertest(server)
                .post(`/api/users/${user.id.toString()}/lists`)
                .set(buildAuthorizationHeader(user.name, "a wrong password"))
                .send({ songs })
                .expect(401)
                .end((error, response) => {
                    if (error) return done(error);
                    expect(response.body).toMatchObject({ message: "unauthorized user" });
                    return done()
                });
        });

        it("with wrong userName when POST /api/users/:userId/lists then returns 401 UnauthorizedUser", done => {
            supertest(server)
                .post(`/api/users/${user.id.toString()}/lists`)
                .set(buildAuthorizationHeader("wrong userName", user.password))
                .send({ songs })
                .expect(401)
                .end((error, response) => {
                    if (error) return done(error);
                    expect(response.body).toMatchObject({ message: "unauthorized user" });
                    return done()
                });
        });
    });
});