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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Express = require("express");
const HttpStatusCodes = require("http-status-codes");
const expressutils_1 = require("../../../util/expressutils");
const servererrorinfo_1 = require("../../common/servererrorinfo");
const servererrorcode_1 = require("../../common/servererrorcode");
const errorhandler_1 = require("../../../common/error/errorhandler");
const authenticationerror_1 = require("../../../common/error/types/authenticationerror");
const authenticate_1 = require("../../common/decorators/authenticate");
const body_1 = require("../../common/decorators/body");
const validateloginpayload_1 = require("./payloads/validateloginpayload");
const logincredentialspayload_1 = require("./payloads/logincredentialspayload");
const inversify_1 = require("inversify");
const ioctypes_1 = require("../../../common/ioc/ioctypes");
/**
 * Router responsible for handling all incoming
 * requests related to authentication, and more.
 */
let AuthHandler = class AuthHandler {
    /**
     * Create a new auth handler.
     * @param authService The authservice to use.
     * @param userService The user service to use.
     */
    constructor(authService, userService) {
        this.authService = authService;
        this.userService = userService;
        this.expressRouter = Express.Router();
    }
    /**
     * Initialize the handler for use.
     * @param expressApp The express application to work with.
     *
     */
    initRoutes(expressApp) {
        this.expressRouter.put('/login/', (req, res) => __awaiter(this, void 0, void 0, function* () { return this.loginUser(req, res); }));
        this.expressRouter.delete('/login/', (req, res) => __awaiter(this, void 0, void 0, function* () { return this.logoutUser(req, res); }));
        this.expressRouter.post('/validate/', (req, res) => __awaiter(this, void 0, void 0, function* () { return this.validateUserLogin(req, res); }));
        expressApp.use('/auth/', this.expressRouter);
    }
    /**
     * Process a request to log in a user either throw a JWT
     * or the body containing a username, and password.
     * @param request The incoming client request.
     * @param response The response being beu
     */
    loginUser(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            let bearerToken = expressutils_1.ExpressUtils.getBearerToken(request);
            let accessToken;
            try {
                //Is there a bearer token?
                if (bearerToken != null) {
                    accessToken = yield this.authService.loginUserViaToken(bearerToken);
                }
                //User is authenticating for the first time.
                else {
                    let username = request.body.username;
                    let password = request.body.password;
                    if (username == null) {
                        response.status(HttpStatusCodes.BAD_REQUEST)
                            .json(new servererrorinfo_1.ServerErrorInfo(servererrorcode_1.ServerErrorCode.MissingBodyParameter, 'Username is missing.'));
                        return;
                    }
                    else if (password == null) {
                        response.status(HttpStatusCodes.BAD_REQUEST)
                            .json(new servererrorinfo_1.ServerErrorInfo(servererrorcode_1.ServerErrorCode.MissingBodyParameter, 'Password is missing.'));
                        return;
                    }
                    accessToken = yield this.authService.loginUserViaCredentials(username, password);
                }
                //Send back the access token
                response.status(HttpStatusCodes.OK)
                    .json(accessToken);
            }
            catch (error) {
                new errorhandler_1.ErrorHandler(error)
                    .catch(authenticationerror_1.AuthenticationError, (error) => {
                    response.status(HttpStatusCodes.UNAUTHORIZED)
                        .json(new servererrorinfo_1.ServerErrorInfo(servererrorcode_1.ServerErrorCode.InvalidAuthentication, 'Invalid credentials'));
                })
                    .otherwise((error) => {
                    console.log('An error occured logging in a user: ', error);
                    response.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
                        .json(new servererrorinfo_1.ServerErrorInfo(servererrorcode_1.ServerErrorCode.Unknown));
                });
            }
        });
    }
    /**
     * Process a request to log out a user. This expects them to pass in
     * their JWT, or else it is rejected.
     * @param request The incoming request to process.
     * @param response The outgoing response being built.
     */
    logoutUser(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.authService.logoutUser(request.user);
                response.sendStatus(HttpStatusCodes.OK);
            }
            catch (error) {
                console.log('An error occured logging out a user: ', error);
                response.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
                    .json(new servererrorinfo_1.ServerErrorInfo(servererrorcode_1.ServerErrorCode.Unknown));
            }
        });
    }
    /**
     * Validate a user's login. This simply checks that a user is who they
     * claim to be.
     * @param request The incoming request to process.
     * @param response The outgoing response being built.
     */
    validateUserLogin(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let user = yield this.userService.findByUsername(request.body.username);
                if (user == null) {
                    response.sendStatus(HttpStatusCodes.UNAUTHORIZED);
                    return;
                }
                let isValid = yield this.authService.validateLogin(user, request.body.loginCode);
                if (isValid) {
                    response.status(HttpStatusCodes.OK)
                        .json({ userId: user.id });
                }
                else {
                    response.sendStatus(HttpStatusCodes.UNAUTHORIZED);
                }
            }
            catch (error) {
                console.log('An error occured validating a user login: ', error);
                response.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
                    .json(new servererrorinfo_1.ServerErrorInfo(servererrorcode_1.ServerErrorCode.Unknown));
            }
        });
    }
};
__decorate([
    body_1.body(logincredentialspayload_1.LoginCredentialsPayload, { optional: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthHandler.prototype, "loginUser", null);
__decorate([
    authenticate_1.authenticate(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthHandler.prototype, "logoutUser", null);
__decorate([
    body_1.body(validateloginpayload_1.ValidateLoginPayload),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthHandler.prototype, "validateUserLogin", null);
AuthHandler = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(ioctypes_1.IOC_TYPES.AuthService)),
    __param(1, inversify_1.inject(ioctypes_1.IOC_TYPES.UserService)),
    __metadata("design:paramtypes", [Object, Object])
], AuthHandler);
exports.AuthHandler = AuthHandler;
//# sourceMappingURL=authhandler.js.map