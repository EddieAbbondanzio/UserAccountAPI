"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Express = require("express");
const notimplementederror_1 = require("../../../common/error/types/notimplementederror");
/**
 * Router responsible for handling all incoming
 * requests related to authentication, and more.
 */
class AuthHandler {
    /**
     * Create a new auth handler.
     * @param authService The authservice to use.
     */
    constructor(authService) {
        this.authService = authService;
        this.expressRouter = Express.Router();
    }
    /**
     * Initialize the handler for use.
     * @param expressApp The express application to work with.
     */
    initRoutes(expressApp) {
        throw new notimplementederror_1.NotImplementedError();
    }
    loginUser(request, response) {
        //Need to handle 
        throw new notimplementederror_1.NotImplementedError();
    }
    logoutUser(request, response) {
        throw new notimplementederror_1.NotImplementedError();
    }
    updatePassword(request, response) {
        throw new notimplementederror_1.NotImplementedError();
    }
    resetPassword(request, response) {
        throw new notimplementederror_1.NotImplementedError();
    }
    registerNewUser(request, response) {
        throw new notimplementederror_1.NotImplementedError();
    }
    verifyEmail(request, response) {
        throw new notimplementederror_1.NotImplementedError();
    }
    sendVerificationEmail(request, response) {
        throw new notimplementederror_1.NotImplementedError();
    }
    resendVerificationEmail(request, response) {
        throw new notimplementederror_1.NotImplementedError();
    }
    validateUserLogin(request, response) {
        throw new notimplementederror_1.NotImplementedError();
    }
    forgotUsername(request, response) {
        throw new notimplementederror_1.NotImplementedError();
    }
    forgotPassword(request, response) {
        throw new notimplementederror_1.NotImplementedError();
    }
}
exports.AuthHandler = AuthHandler;
//# sourceMappingURL=authhandler.js.map