import { readExpressConfig } from "./infrastructure/express/express-config";
import { createServer, runServer } from "./infrastructure/express/run-express-server";
import { healthCheckRoutes } from "./infrastructure/express/health-check-routes";
import { loggerMiddleware } from "./infrastructure/express/request-logger-middleware";
import { playlistRoutes } from "./playlists/api/playlists-routes";
import { authorizeMiddleware } from "./users/api/authorize-middleware";
import { authenticate } from "./users/authenticate";
import { mongoGetUserByName } from "./users/get-user";
import { declareAddPlaylistEndpoint } from "./playlists/api/endpoints/add-playlist-endpoint";
import { addPlaylistToUser } from "./playlists/add-playlist";
import { mongoStoreNewPlaylist, mongoUpdatePlaylist } from "./playlists/store-playlist";
import { declareAddSongToPlaylistEndpoint } from "./playlists/api/endpoints/add-song-to-playlist-endpoint";
import { addSongToPlaylist } from "./playlists/add-song-to-playlist";
import { getPlaylistById, getUserPlaylists } from "./playlists/get-playlist";
import { declareGetPlaylistEndpoint } from "./playlists/api/endpoints/get-playlist-endpoint";
import { declareGetPlaylistsEndpoint } from "./playlists/api/endpoints/get-playlists-endpoint";

const server = createServer(
    readExpressConfig,
    [
        healthCheckRoutes, 
        playlistRoutes([
            declareAddPlaylistEndpoint(addPlaylistToUser(mongoStoreNewPlaylist)),
            declareAddSongToPlaylistEndpoint(addSongToPlaylist({
                storePlaylist: mongoUpdatePlaylist,
                getPlaylist: getPlaylistById
            })),
            declareGetPlaylistEndpoint(getPlaylistById),
            declareGetPlaylistsEndpoint(getUserPlaylists),
        ]),
    ], 
    [
        authorizeMiddleware(authenticate(mongoGetUserByName)),
        loggerMiddleware,
    ]
);

runServer(server);