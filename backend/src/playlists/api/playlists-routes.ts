import { Router, Express, IRouter } from "express";
import { ExpressEndpointDeclarations } from "../../infrastructure/express/express-endpoint";
import { ExpressRouter } from "../../infrastructure/express/express-router";

const baseRoute = "/api/users";

const addEndpoints = (router: IRouter, endpoints: ExpressEndpointDeclarations): IRouter => {
    const popEndpoints = [...endpoints];
    const endpoint = popEndpoints.pop();

    return !endpoint ? router : addEndpoints(endpoint(router), popEndpoints);
}

export const playlistRoutes: (endpoints: ExpressEndpointDeclarations) => ExpressRouter = (endpoints: ExpressEndpointDeclarations) => 
    (expressApp: Express) => expressApp.use(
        baseRoute, 
        addEndpoints(Router(), endpoints)
    );