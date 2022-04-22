
import request from 'supertest'
import { Express } from 'express';
import { createServer } from '../../../src/infrastructure/express/run-express-server';
import { healthCheckRoutes } from '../../../src/infrastructure/express/health-check-routes';

describe("GET /api/health", () => {
    let server: Express;

    beforeEach(() => {
        server = createServer(
            () => ({  ApiPort: "4000" }),
            [
                healthCheckRoutes
            ],
            []
        );
    });

    it("should retun 200 & 'hello world' message", done => {
        request(server)
            .get("/api/health")
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.text).toBe("hello world! :)");
                done()
            });
    });

    it("given message parameter should retun 200 & the same message back", done => {
        const message = "hello world my good friend! :)";
        request(server)
            .get(`/api/health/${message}`)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.text).toBe(message);
                done()
            });
    });
});