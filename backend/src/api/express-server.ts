import 'reflect-metadata'
import express, { Express } from 'express';

export class ExpressServer {
    private app: Express = express()

    Configure(): ExpressServer {
        this.app.set('port', process.env.API_PORT || 4000);
        this.ApplyMiddleware();
        this.AddRoutes();
        return this;
    }

    private AddRoutes() {
        throw new Error('Method not implemented.');
    }

    private ApplyMiddleware() {
        throw new Error('Method not implemented.');
    }
    
    Start() {
        this.app.listen(
            this.app.get('port'), 
            '0.0.0.0', 
            () => console.log('the server is running on', this.app.get('port'))
        );
    }
}

export const runServer = () => new ExpressServer().Configure().Start();