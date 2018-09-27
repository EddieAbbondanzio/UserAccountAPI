"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const baserouter_1 = require("../common/baserouter");
const HttpStatus = require("http-status-codes");
/**
 * Handles login requests, along with middleware for
 * checking incoming requests for a json web token
 * attached to them.
 */
class AuthenticationRouter extends baserouter_1.BaseRouter {
    /**
     * Create a new instance of the authentication router.
     * @param serviceLocator The service locator for finding
     * any needed services.
     */
    constructor(serviceLocator) {
        super();
        this.userService = serviceLocator.userService;
        this.authService = serviceLocator.authService;
    }
    /**
     * Process a request to login under the passed in credentials.
     * @param request The request making the login attempt.
     * @param response The response to send back to the caller.
     */
    loginUser(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!request.body) {
                response.sendStatus(HttpStatus.BAD_REQUEST);
            }
            let username = request.body.username;
            let password = request.body.password;
            if (!username || !password) {
                response.sendStatus(HttpStatus.BAD_REQUEST);
            }
            try {
                let login = yield this.authService.loginUser(username, password);
                if (login) {
                    response.send(login);
                }
                else {
                    response.sendStatus(HttpStatus.UNAUTHORIZED);
                }
            }
            catch (error) {
                console.log('LoginRouter.loginUser(): ', error);
                response.sendStatus(HttpStatus.UNAUTHORIZED);
            }
        });
    }
    /**
     *
     * @param request The request making the logout attempt.
     * @param response The response to send back to the caller.
     */
    logoutUser(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!request.body || !request.body.loginGuid) {
                response.sendStatus(HttpStatus.BAD_REQUEST);
            }
            try {
                let loginGuid = request.body.loginGuid;
                yield this.authService.logoutUser(loginGuid);
                response.sendStatus(HttpStatus.OK);
            }
            catch (error) {
                console.log('AuthenticationRouter.logoutUser(): ', error);
                response.sendStatus(HttpStatus.BAD_REQUEST);
            }
        });
    }
    /**
     * Checks incoming requests to see if the user has
     * a json web token in their request or not. If they
     * do we validate them pull in the user.
     * @param request The request to check for a bearer token
     * @param response The response being built for them.
     * @param next
     */
    processRequestForLogin(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            //Nothing to bother with, skip.
            if (!request.headers || !request.headers.authorization) {
                next();
                return;
            }
            let token = request.headers.authorization.split(' ')[1];
            //Request had token, try to validate it
            if (token) {
                try {
                    let user = yield this.authService.validateToken(token);
                    //We pop a user property onto the request.
                    if (user != null) {
                        request.user = user;
                    }
                }
                catch (error) {
                    console.log('AuthenticationRouter.processRequestForLogin(): ', error);
                }
            }
            next();
        });
    }
    /**
     * Initialize the router and any services needed.
     */
    init() {
        this.loginUser.bind(this);
        this.router.post('/login', (req, res) => __awaiter(this, void 0, void 0, function* () { return this.loginUser(req, res); }));
    }
}
exports.AuthenticationRouter = AuthenticationRouter;

//# sourceMappingURL=authenticationrouter.js.map
