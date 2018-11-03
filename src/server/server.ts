import * as Express from 'express';
import { IUserHandler } from './handlers/iuserhandler';
import { IAuthHandler } from './handlers/iauthhandler';
import { Config } from '../config/config';
import bodyParser = require('body-parser');
import * as HttpStatusCodes from 'http-status-codes';

/**
 * The HTTP server that handles incoming requests, and
 * builds responses to send back to them.
 */
export class Server {
    /**
     * The singleton instance of the server.
     */
    public static instance: Server;

    /**
     * The running instance of express.
     */
    private express: Express.Application;

    /**
     * The user handler for all incoming user related 
     * requests.
     */
    private userHandler: IUserHandler;

    /**
     * The auth handler for all incoming  authentication
     *  related requests.
     */
    private authHandler: IAuthHandler;

    /**
     * Create a new server.
     * @param userHandler The user handler.
     * @param authHandler The auth handler.
     */
    constructor( userHandler: IUserHandler, authHandler: IAuthHandler) {
        this.express = Express();
        this.express.listen(Config.current.port, () => {
            console.log(`Listening on port ${Config.current.port}`)
        })

        Server.instance = this;
        
        this.userHandler = userHandler;
        this.authHandler = authHandler;

        this.initMiddleware();
        this.initRoutes();
    }

    /**
     * Initialize any middleware with the server.
     */
    private initMiddleware(): void {
        this.express.use(bodyParser.json());
    }

    /**
     * Initialize all the routes of the server for use.
     */
    private initRoutes(): void {    
        this.userHandler.initRoutes(this.express);
    }
}