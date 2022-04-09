import { readExpressConfig } from "./infrastructure/express/express-config";
import { runServer } from "./infrastructure/express/express-server";
import { healthCheckRoutes } from "./infrastructure/express/health-check-routes";

const runApp = async () => {
    runServer(readExpressConfig, [healthCheckRoutes()], [])
    return Promise.resolve();
}
runApp();