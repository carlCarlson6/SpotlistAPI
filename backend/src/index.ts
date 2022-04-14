import { readExpressConfig } from "./infrastructure/express/express-config";
import { runServer } from "./infrastructure/express/run-express-server";
import { healthCheckRoutes } from "./infrastructure/express/health-check-routes";
import { loggerMiddleware } from "./infrastructure/express/request-logger-middleware";
import { playlistRoutes } from "./playlists/api/playlists-routes";
import { authorizeMiddleware } from "./users/api/authorize-middleware";
import { authenticate } from "./users/authenticate";
import { mongoGetUserByName } from "./users/get-user";

runServer(
    readExpressConfig,
    [
        healthCheckRoutes(), 
        playlistRoutes(),
    ],
    [
        authorizeMiddleware(authenticate(mongoGetUserByName)),
        loggerMiddleware,
    ]);