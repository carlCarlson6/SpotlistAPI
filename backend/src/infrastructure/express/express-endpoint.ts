import { Request, Response } from "express"

export interface ExpressEndpoint {
    declareEndpoint(): void
    excute(request: Request, response: Response): Promise<Response>
}

export type ExpressEndpoints = ExpressEndpoint[];