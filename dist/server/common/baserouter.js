"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
/**
 * A base class for building off of that will provide some preset
 * functionality to any service.
 */
class BaseRouter {
    /**
     * Create a new base router that will handle
     * extra functionality for the server.
     */
    constructor() {
        this.router = express_1.Router();
        this.init();
    }
    /**
     * Getter for retrieving the express
     * router of this custom router.
     */
    getRouter() {
        return this.router;
    }
}
exports.BaseRouter = BaseRouter;

//# sourceMappingURL=baserouter.js.map
