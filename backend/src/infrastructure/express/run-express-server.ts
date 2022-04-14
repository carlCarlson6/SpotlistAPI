import 'reflect-metadata'
import express, { Express } from 'express';
import { ExpressRouter, ExpressRouters } from './express-router';
import { ExpressMiddleware, ExpressMiddlewares } from './express-middleware';
import { ExpressConfigurationReader } from './express-config';

const addMiddleware = (app: Express): ((middleware: ExpressMiddleware) => void) => (middleware: ExpressMiddleware) => app.use(middleware);
const addRouter = (app: Express): ((router: ExpressRouter) => void) => (router: ExpressRouter) => app.use(router.path, router.router);

export const runServer = (configReader: ExpressConfigurationReader, routers: ExpressRouters, middlewares: ExpressMiddlewares) => {
    const app = express();
    
    app.set('port', configReader().ApiPort || 4000);

    middlewares.forEach(addMiddleware(app));
    routers.forEach(addRouter(app));
    
    return app.listen(
        app.get('port'), 
        '0.0.0.0', 
        () => console.log('the server is running on', app.get('port'))
    );
}