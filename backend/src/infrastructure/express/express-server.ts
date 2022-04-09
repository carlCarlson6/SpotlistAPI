import 'reflect-metadata'
import express, { Express } from 'express';
import { healthCheckRoutes } from './health-check-routes';

export class ExpressServer {
    private app: Express = express()
    private routes = [
        healthCheckRoutes()
    ]

    configure(): ExpressServer {
        this.app.set('port', process.env.API_PORT || 4000);
        this.applyMiddleware();
        this.addRoutes();
        return this;
    }

    private addRoutes() {
        this.routes.forEach(router => {
            router.declareRoutes();
            console.log(router.path);
            this.app.use(router.path, router.router);
        });
    }

    private applyMiddleware() {
        throw new Error('Method not implemented.');
    }
    
    start() {
        this.app.listen(
            this.app.get('port'), 
            '0.0.0.0', 
            () => console.log('the server is running on', this.app.get('port'))
        );
    }
}

export const runServer = () => new ExpressServer().configure().start();