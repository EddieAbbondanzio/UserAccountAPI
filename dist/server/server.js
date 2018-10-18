"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const Express = require("express");
const BodyParser = require("body-parser");
const authcontroller_1 = require("./controllers/authcontroller");
const usercontroller_1 = require("./controllers/usercontroller");
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
        this.authController = new authcontroller_1.AuthController(serviceLocator);
        this.userController = new usercontroller_1.UserController(serviceLocator);
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
    }
    /**
     * Set up the routes of the controllers
     * by express.
     */
    configureRoutes() {
        this.express.use('/user/', this.userController.getRouter());
        this.express.use('/auth/', this.authController.getRouter());
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