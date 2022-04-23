import request from 'supertest'
import { none, some } from 'typescript-monads';
import { Id } from '../../../src/common/id';
import { createServer } from '../../../src/infrastructure/express/run-express-server';
import { declareGetPlaylistsEndpoint } from '../../../src/playlists/api/endpoints/get-playlists-endpoint';
import { playlistRoutes } from '../../../src/playlists/api/playlists-routes';
import { Owner } from '../../../src/playlists/playlist';
import { authorizeMiddleware } from '../../../src/users/api/authorize-middleware';
import { authenticate } from '../../../src/users/authenticate';
import { Password } from '../../../src/users/password';
import { User } from '../../../src/users/user';

const buildAuthorizationHeader = (name: string, password: string) => 
    ({ Authorization: `Basic ${Buffer.from(name + ':' + password).toString('base64')}` })

describe("GET /api/users/:userId/lists", () => {
    it("given user without playlists should return empty list", done => {
        const user = {
            id: Id.createNew(),
            name: "userName",
            password: "uS3rP@ssw0rd"
        };

        const server = createServer(
            () => ({ ApiPort: "4000" }),
            [
                playlistRoutes([
                    declareGetPlaylistsEndpoint((_: Owner) => Promise.resolve([]))
                ]),
            ],
            [
                authorizeMiddleware(authenticate((_: string) => 
                    User.create(user.id, user.name, Password.create(user.password), new Date())
                        .match({
                            ok: user => Promise.resolve(some(user)),
                            fail: _ => Promise.resolve(none())
                        })
                ))
            ]
        );

        request(server)
            .get(`/api/users/${user.id.toString()}/lists`)
            .set(buildAuthorizationHeader(user.name, user.password))
            .expect(200)
            .end((error, response) => {
                if (error) return done(error);
                expect(response.body).toMatchObject([]);
                return done()
            });
    })
});