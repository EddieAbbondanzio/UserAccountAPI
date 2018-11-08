"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var Server_1;
const Express = require("express");
const config_1 = require("../config/config");
const bodyParser = require("body-parser");
const inversify_1 = require("inversify");
const ioctypes_1 = require("../common/ioc/ioctypes");
/**
 * The HTTP server that handles incoming requests, and
 * builds responses to send back to them.
 */
let Server = Server_1 = class Server {
    /**
     * Create a new server.
     * @param config The server's config.
     * @param userHandler The user handler.
     * @param authHandler The auth handler.
     * @param accountHandler The account handler.
     */
    constructor(config, userHandler, authHandler, accountHandler) {
        this.express = Express();
        this.express.listen(config.port, () => {
            console.log(`Listening on port ${config.port}`);
        });
        Server_1.instance = this;
        this.userHandler = userHandler;
        this.authHandler = authHandler;
        this.accountHandler = accountHandler;
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
        this.authHandler.initRoutes(this.express);
        this.accountHandler.initRoutes(this.express);
    }
};
Server = Server_1 = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(ioctypes_1.IOC_TYPES.Config)),
    __param(1, inversify_1.inject(ioctypes_1.IOC_TYPES.UserHandler)),
    __param(2, inversify_1.inject(ioctypes_1.IOC_TYPES.AuthHandler)),
    __param(3, inversify_1.inject(ioctypes_1.IOC_TYPES.AccountHandler)),
    __metadata("design:paramtypes", [config_1.Config, Object, Object, Object])
], Server);
exports.Server = Server;
//# sourceMappingURL=server.js.map