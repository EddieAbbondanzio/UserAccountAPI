"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Express = require("express");
/**
 * The HTTP server that handles incoming requests, and
 * builds responses to send back to them.
 */
class Server {
    /**
     * Create a new server.
     */
    constructor() {
        this.express = Express();
        this.initMiddleware();
        this.initRoutes();
    }
    /**
     * Initialize any middleware with the server.
     */
    initMiddleware() {
    }
    /**
     * Initialize all the routes of the server for use.
     */
    initRoutes() {
    }
}
exports.Server = Server;
//# sourceMappingURL=server.js.map