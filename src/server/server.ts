import * as http from 'http';
import * as Express from 'express';
import { UserRouter } from './user/userrouter';
import * as BodyParser from 'body-parser';
import { AuthenticationRouter } from './security/authenticationrouter';
import { IServiceLocator } from '../logic/iservicelocator';

/**
 * Server instance of the application. Handles
 * processing HTTP Requests and more.
 */
export class Server {
    /**
     * The standard port to use for the server.
     * This will likely never change.
     */
    private static defaultPort = process.env.PORT || 3000;

    /**
     * The express instance that is handling all of 
     * the HTTP magic.
     */
    private express: Express.Application;

    /**
     * The underlying HTTP server used by express.
     */
    private httpServer: http.Server;

    public userRouter: UserRouter;

    public authRouter: AuthenticationRouter;

    /**
     * Create a new server for handling users.
     * @param serviceLocator The service locator for finding
     * any needed dependencies.
     */
    constructor(serviceLocator: IServiceLocator) {
        this.userRouter = new UserRouter(serviceLocator);
        this.authRouter = new AuthenticationRouter(serviceLocator);

        this.express = Express();
        this.configureMiddleware();
        this.configureRoutes();
        
        this.httpServer = http.createServer(this.express);
        this.httpServer.listen(Server.defaultPort);
        this.httpServer.on('error', this.onError);
    }

    /**
     * Set up the middleware utilities used
     * by express. The auth router will automatically
     * check for a JWT on every incoming request.
     */
    private configureMiddleware() {
        this.express.use(BodyParser.json());
        this.express.use(this.authRouter.processRequestForLogin);
    }

    /**
     * Set up the routes of the controllers
     * by express.
     */
    private configureRoutes() {
        this.express.use('/user/', this.userRouter.getRouter());
        this.express.use('/auth/', this.authRouter.getRouter());
    }

    /**
     * Log errors whenever they happen.
     * @param error The error that occured.
     */
    private onError(error: NodeJS.ErrnoException): void {
        if (error.syscall !== 'listen') throw error;
        let bind = (typeof Server.defaultPort === 'string') ? 'Pipe ' + Server.defaultPort : 'Port ' + Server.defaultPort;
        switch(error.code) {
          case 'EACCES':
            console.error(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
          case 'EADDRINUSE':
            console.error(`${bind} is already in use`);
            process.exit(1);
            break;
          default:
            throw error;
        }
    }
}