import supertest from 'supertest'
import { Id } from '../../../src/common/id';
import { createServer } from '../../../src/infrastructure/express/run-express-server';
import { declareGetPlaylistsEndpoint } from '../../../src/playlists/api/endpoints/get-playlists-endpoint';
import { playlistRoutes } from '../../../src/playlists/api/playlists-routes';
import { Owner } from '../../../src/playlists/playlist';
import { buildAuthorizationHeader } from '../../helpers/build-authorization-header';
import { defaultExpressConfigurationReader } from '../../helpers/default-express-configuration-reader';
import { inMemoryAuthorizeMiddleware } from '../../helpers/inmemory-authorize-middleware';
import { userCarlKarlson as user } from "../../helpers/test-users";

describe("given API with in memory database", () => {
    describe("given authorized user without playlists", () => {
        const server = createServer(
            defaultExpressConfigurationReader,
            [
                playlistRoutes([
                    declareGetPlaylistsEndpoint((_: Owner) => Promise.resolve([]))
                ]),
            ],
            [ inMemoryAuthorizeMiddleware ]
        );
        
        it("when GET /api/users/:userId/lists then returns 200OK empty list", done => {
            supertest(server)
                .get(`/api/users/${user.id.toString()}/lists`)
                .set(buildAuthorizationHeader(user.name, user.password))
                .expect(200)
                .end((error, response) => {
                    if (error) return done(error);
                    expect(response.body).toMatchObject([]);
                    return done()
                });
        });

        it("when GET /api/users/:userId/lists with a different userId then returns 401 UnauthorizedOperation", done => {
            supertest(server)
                .get(`/api/users/${Id.createNew().toString()}/lists`)
                .set(buildAuthorizationHeader(user.name, user.password))
                .expect(401)
                .end((error, response) => {
                    if (error) return done(error);
                    expect(response.body).toMatchObject({ message: "unauthorized operation" });
                    return done()
                });
        });
    });
    
    describe("given unauthorized user", () => {
        const server = createServer(
            defaultExpressConfigurationReader,
            [],
            [ inMemoryAuthorizeMiddleware ]
        );

        it("with wrong password when GET /api/users/:userId/lists then returns 401 UnauthorizedUser", done => {
            supertest(server)
                .get(`/api/users/${user.id.toString()}/lists`)
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
                .get(`/api/users/${user.id.toString()}/lists`)
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