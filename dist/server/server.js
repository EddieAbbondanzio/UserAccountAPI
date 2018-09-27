"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const Express = require("express");
const userrouter_1 = require("./user/userrouter");
const BodyParser = require("body-parser");
const authenticationrouter_1 = require("./security/authenticationrouter");
/**
 * Server instance of the application. Handles
 * processing HTTP Requests and more.
 */
class Server {
    /**
     * Create a new server for handling users.
     * @param serviceLocator The service locator for finding
     * any needed dependencies.
     */
    constructor(serviceLocator) {
        this.userRouter = new userrouter_1.UserRouter(serviceLocator);
        this.authRouter = new authenticationrouter_1.AuthenticationRouter(serviceLocator);
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
    configureMiddleware() {
        this.express.use(BodyParser.json());
        this.express.use(this.authRouter.processRequestForLogin);
    }
    /**
     * Set up the routes of the controllers
     * by express.
     */
    configureRoutes() {
        this.express.use('/user/', this.userRouter.getRouter());
        this.express.use('/auth/', this.authRouter.getRouter());
    }
    /**
     * Log errors whenever they happen.
     * @param error The error that occured.
     */
    onError(error) {
        if (error.syscall !== 'listen')
            throw error;
        let bind = (typeof Server.defaultPort === 'string') ? 'Pipe ' + Server.defaultPort : 'Port ' + Server.defaultPort;
        switch (error.code) {
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
/**
 * The standard port to use for the server.
 * This will likely never change.
 */
Server.defaultPort = process.env.PORT || 3000;
exports.Server = Server;

//# sourceMappingURL=server.js.map
