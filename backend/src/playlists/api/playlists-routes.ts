import { Router, Express } from "express";
import { ExpressEndpointDeclarations } from "../../infrastructure/express/express-endpoint";
import { ExpressRouter } from "../../infrastructure/express/express-router";

export const playlistRoutes: (endpoints: ExpressEndpointDeclarations) => ExpressRouter = (endpoints: ExpressEndpointDeclarations) => (expressApp: Express) => {
    const router = Router();
    endpoints.map(endpoint => endpoint(router));
    return expressApp.use("api/users/:userId/lists", router);
};
