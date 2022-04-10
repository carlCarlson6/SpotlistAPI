import { readExpressConfig } from "./infrastructure/express/express-config";
import { ExpressMiddlewares } from "./infrastructure/express/express-middleware";
import { runServer } from "./infrastructure/express/express-server";
import { healthCheckRoutes } from "./infrastructure/express/health-check-routes";
import { loggerMiddleware } from "./infrastructure/express/request-logger-middleware";
import { playlistRoutes } from "./playlists/api/playlists-routes";

const routes = [
    healthCheckRoutes(), 
    playlistRoutes(),
];

const middlewares: ExpressMiddlewares = [
    loggerMiddleware,
];

(async () => {
    runServer(readExpressConfig, routes, middlewares);
})()
