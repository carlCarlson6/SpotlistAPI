import { ExpressConfigurationReader } from "../../../src/infrastructure/express/express-config";

export const defaultExpressConfigurationReader: ExpressConfigurationReader = () => ({ 
        ApiPort: "4000" 
    });