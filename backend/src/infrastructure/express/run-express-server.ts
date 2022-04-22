import 'reflect-metadata'
import express, { Express } from 'express';
import { ExpressRouter, ExpressRouters } from './express-router';
import { ExpressMiddleware, ExpressMiddlewares } from './express-middleware';
import { ExpressConfigurationReader } from './express-config';

const addMiddleware = (app: Express): ((middleware: ExpressMiddleware) => void) => (middleware: ExpressMiddleware) => app.use(middleware);
const addRouter = (app: Express): ((router: ExpressRouter) => Express) => (router: ExpressRouter) => router(app);

export const createServer = (configReader: ExpressConfigurationReader, routers: ExpressRouters, middlewares: ExpressMiddlewares) => {
    const server = express();
    
    server.set('port', configReader().ApiPort || 4000);

    middlewares.forEach(addMiddleware(server));
    routers.forEach(addRouter(server));

    return server;
}

export const runServer = (server: Express) => 
    server.listen(
        server.get('port'), 
        '0.0.0.0', 
        () => console.log('the server is running on', server.get('port'))
    );