import { IRouter, Router } from "express";

export type ExpressEndpointDeclaration = (router: IRouter) => IRouter;
export type ExpressEndpointDeclarations = ExpressEndpointDeclaration[];
