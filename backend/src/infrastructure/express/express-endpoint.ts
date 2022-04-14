import { Response } from "express";

export interface ExpressEndpoint {
    declareEndpoint(): void
}

export type ExpressEndpoints = ExpressEndpoint[];

export type Endpoint = (request: Response, response: Response) => Promise<Response>;