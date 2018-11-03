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
     * Create a new auth router.
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
        throw new notimplementederror_1.NotImplementedError();
        //Handles JWT first
        //Then checks body otherwise.
    }
    logoutUser(request, response) {
        throw new notimplementederror_1.NotImplementedError();
        //Handles JWT first
        //Then checks body otherwise.
    }
    updatePassword(request, response) {
        throw new notimplementederror_1.NotImplementedError();
        //Handles JWT first
        //Then checks body otherwise.
    }
    resetPassword(request, response) {
        throw new notimplementederror_1.NotImplementedError();
        //Handles JWT first
        //Then checks body otherwise.
    }
    registerNewUser(request, response) {
        throw new notimplementederror_1.NotImplementedError();
        //Handles JWT first
        //Then checks body otherwise.
    }
    verifyEmail(request, response) {
        throw new notimplementederror_1.NotImplementedError();
        //Handles JWT first
        //Then checks body otherwise.
    }
    sendVerificationEmail(request, response) {
        throw new notimplementederror_1.NotImplementedError();
        //Handles JWT first
        //Then checks body otherwise.
    }
    resendVerificationEmail(request, response) {
        throw new notimplementederror_1.NotImplementedError();
        //Handles JWT first
        //Then checks body otherwise.
    }
    validateUserLogin(request, response) {
        throw new notimplementederror_1.NotImplementedError();
        //Handles JWT first
        //Then checks body otherwise.
    }
    forgotUsername(request, response) {
        throw new notimplementederror_1.NotImplementedError();
        //Handles JWT first
        //Then checks body otherwise.
    }
    forgotPassword(request, response) {
        throw new notimplementederror_1.NotImplementedError();
        //Handles JWT first
        //Then checks body otherwise.
    }
}
exports.AuthHandler = AuthHandler;
//# sourceMappingURL=authhandler.js.map