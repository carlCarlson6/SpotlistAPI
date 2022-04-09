import { Request, Response } from "express"

export interface ExpressEndpoint {
    declareEndpoint(): void
}

export type ExpressEndpoints = ExpressEndpoint[];