import { config as readEnvConfig } from "dotenv";

export interface ExpressConfiguration {
    ApiPort: string
}

export type ExpressConfigurationReader = () => ExpressConfiguration;

export const readExpressConfig: ExpressConfigurationReader = () => {
    readEnvConfig();
    const ApiPort = process.env.API_PORT ? process.env.API_PORT : '4000'
    
    return {
        ApiPort
    }
}
