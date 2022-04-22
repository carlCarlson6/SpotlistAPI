import { Router } from "express";

export type ExpressEndpointDeclaration = (router: Router) => void;
export type ExpressEndpointDeclarations = ExpressEndpointDeclaration[];
