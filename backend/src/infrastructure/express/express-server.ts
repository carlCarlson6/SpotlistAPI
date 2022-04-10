import 'reflect-metadata'
import express, { Express } from 'express';
import { ExpressRouters } from './express-router';
import { ExpressMiddleware, ExpressMiddlewares } from './express-middleware';
import { ExpressConfiguration, ExpressConfigurationReader } from './express-config';

export class ExpressServer {
    private app: Express = express()

    constructor(
        private readonly routers: ExpressRouters,
        private readonly middlewares: ExpressMiddlewares,
    ) { }

    configure(config: ExpressConfiguration): ExpressServer {
        this.app.set('port', config.ApiPort || 4000);
        this.applyMiddleware();
        this.addRoutes();
        return this;
    }

    private addRoutes() {
        this.routers.forEach(router => {
            router.declareRoutes();
            console.log(router.path);
            this.app.use(router.path, router.router);
        });
    }

    private applyMiddleware() {
        this.middlewares.forEach(middleware => this.app.use(middleware));
    }
    
    start() {
        this.app.listen(
            this.app.get('port'), 
            '0.0.0.0', 
            () => console.log('the server is running on', this.app.get('port'))
        );
    }
}

export const runServer = (configReader: ExpressConfigurationReader, routes: ExpressRouters, middlewares: ExpressMiddleware[]) => 
    new ExpressServer(routes, middlewares)
        .configure(configReader())
        .start();