import supertest from 'supertest'
import { Id } from '../../../src/common/id';
import { createServer } from "../../../src/infrastructure/express/run-express-server";
import { buildAuthorizationHeader } from '../helpers/build-authorization-header';
import { defaultExpressConfigurationReader } from "../helpers/default-express-configuration-reader";
import { inMemoryAuthorizeMiddleware } from "../helpers/inmemory-authorize-middleware";
import { userCarlKarlson as user } from "../helpers/test-users";

describe("given API with in memory database", () => {
    describe("given unauthorized user", () => {
        const server = createServer(defaultExpressConfigurationReader, [], [inMemoryAuthorizeMiddleware]);

        it("with wrong password when POST /api/users/:userId/lists then returns 401 UnauthorizedUser", done => {
            supertest(server)
                .post(`/api/users/${user.id.toString()}/lists/${Id.createNew().toString()}`)
                .set(buildAuthorizationHeader(user.name, "a wrong password"))
                .expect(401)
                .end((error, response) => {
                    if (error) return done(error);
                    expect(response.body).toMatchObject({ message: "unauthorized user" });
                    return done()
                });
        });

        it("with wrong userName when POST /api/users/:userId/lists then returns 401 UnauthorizedUser", done => {
            supertest(server)
                .post(`/api/users/${user.id.toString()}/lists/${Id.createNew().toString()}`)
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