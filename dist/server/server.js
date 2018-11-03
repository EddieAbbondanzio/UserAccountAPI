"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Express = require("express");
const config_1 = require("../config/config");
const bodyParser = require("body-parser");
/**
 * The HTTP server that handles incoming requests, and
 * builds responses to send back to them.
 */
class Server {
    /**
     * Create a new server.
     * @param userHandler The user handler.
     * @param authHandler The auth handler.
     */
    constructor(userHandler, authHandler) {
        this.express = Express();
        this.express.listen(config_1.Config.current.port, () => {
            console.log(`Listening on port ${config_1.Config.current.port}`);
        });
        Server.instance = this;
        this.userHandler = userHandler;
        this.authHandler = authHandler;
        this.initMiddleware();
        this.initRoutes();
    }
    /**
     * Initialize any middleware with the server.
     */
    initMiddleware() {
        this.express.use(bodyParser.json());
    }
    /**
     * Initialize all the routes of the server for use.
     */
    initRoutes() {
        this.userHandler.initRoutes(this.express);
    }
}
exports.Server = Server;
//# sourceMappingURL=server.js.map