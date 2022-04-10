export interface ExpressEndpoint {
    declareEndpoint(): void
}

export type ExpressEndpoints = ExpressEndpoint[];