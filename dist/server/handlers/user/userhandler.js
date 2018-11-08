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
const stringutils_1 = require("../../../util/stringutils");
const errorhandler_1 = require("../../../common/error/errorhandler");
const validationerror_1 = require("../../../logic/validation/validationerror");
const argumenterror_1 = require("../../../common/error/types/argumenterror");
const servererrorinfo_1 = require("../../common/servererrorinfo");
const servererrorcode_1 = require("../../common/servererrorcode");
const body_1 = require("../../common/decorators/body");
const userregistration_1 = require("../../../logic/common/userregistration");
const iaccountservice_1 = require("../../../logic/contract/services/iaccountservice");
const duplicateerror_1 = require("../../../common/error/types/duplicateerror");
const inversify_1 = require("inversify");
const ioctypes_1 = require("../../../common/ioc/ioctypes");
/**
 * Router responsible for handling all incoming
 * requests related to users.
 */
let UserHandler = class UserHandler {
    /**
     * Create a new user router.
     * @param authService The auth service to use.
     * @param userService The userservice to use.
     * @param accountService The account service.
     */
    constructor(authService, userService, accountService) {
        this.authService = authService;
        this.userService = userService;
        this.accountService = accountService;
        this.expressRouter = Express.Router();
    }
    /**
     * Initialize the handler for use.
     * @param expressApp The express application to work with.
     */
    initRoutes(expressApp) {
        //Register, update, or delete user
        this.expressRouter.put('/', (req, res) => __awaiter(this, void 0, void 0, function* () { return this.registerNewUser(req, res); }));
        this.expressRouter.head('/:username', (req, res) => __awaiter(this, void 0, void 0, function* () { return this.isUsernameAvailable(req, res); }));
        this.expressRouter.get('/:identifier', (req, res) => __awaiter(this, void 0, void 0, function* () { return this.findUser(req, res); }));
        expressApp.use('/users/', this.expressRouter);
    }
    /**
     * Register a new user with the system. This will require them to provide
     * a full user registration in the body.
     * @param request The incoming request to process.
     * @param response The outgoing response being built.
     */
    registerNewUser(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //Create the user, then send their verification email.
                let user = yield this.userService.registerNewUser(request.body);
                yield this.accountService.sendVerificationEmail(user);
                //Give them a log in, and send it off to them.
                let token = yield this.authService.loginUser(user);
                response.status(HttpStatusCodes.OK)
                    .json(token);
            }
            catch (error) {
                new errorhandler_1.ErrorHandler(error)
                    .catch(validationerror_1.ValidationError, (error) => {
                    //Need to build a string of all the errors
                    let errorMsg = error.validatorResult.errors.join('\n');
                    //Fire it off to the client.
                    response.status(HttpStatusCodes.BAD_REQUEST)
                        .json(new servererrorinfo_1.ServerErrorInfo(servererrorcode_1.ServerErrorCode.FailedRequest, errorMsg));
                })
                    .catch(duplicateerror_1.DuplicateError, (error) => {
                    response.status(HttpStatusCodes.CONFLICT)
                        .json(new servererrorinfo_1.ServerErrorInfo(servererrorcode_1.ServerErrorCode.FailedRequest, 'Username or email is already in use.'));
                })
                    .otherwise((error) => {
                    console.log('An unknown error occured registering a user: ', error);
                    response.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
                        .json(new servererrorinfo_1.ServerErrorInfo(servererrorcode_1.ServerErrorCode.Unknown));
                });
            }
        });
    }
    /**
     * Process an incoming request to see if a useranme is available
     * via a HEAD request.
     * @param req The incoming request to work with.
     * @param response The outgoing response being built.
     */
    isUsernameAvailable(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            let username = request.params.username;
            if (stringutils_1.StringUtils.isBlank(username)) {
                response.sendStatus(HttpStatusCodes.BAD_REQUEST);
                return;
            }
            try {
                let isAvail = yield this.userService.isUsernameAvailable(username);
                response.sendStatus(isAvail ? HttpStatusCodes.NOT_FOUND : HttpStatusCodes.CONFLICT);
            }
            catch (error) {
                new errorhandler_1.ErrorHandler(error)
                    .catch(argumenterror_1.ArgumentError, (aError) => {
                    response.sendStatus(HttpStatusCodes.BAD_REQUEST);
                })
                    .catch(validationerror_1.ValidationError, (vError) => {
                    response.sendStatus(HttpStatusCodes.NOT_ACCEPTABLE);
                })
                    .otherwiseRaise();
            }
        });
    }
    /**
     * Process a request for a user via GET. This expects a
     * parameter of either a user id, email, or username.
     * @param request The incoming request to work with.
     * @param response The outgoing response being built.
     */
    findUser(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            let identifier = request.params.identifier;
            let user;
            if (stringutils_1.StringUtils.isBlank(identifier)) {
                response.sendStatus(HttpStatusCodes.BAD_REQUEST);
                return;
            }
            try {
                //Is it a user id?
                if (stringutils_1.StringUtils.isNumeric(identifier)) {
                    let id = parseInt(identifier, 10);
                    user = yield this.userService.findById(id);
                }
                //Is it a username?
                else if (stringutils_1.StringUtils.isAlphanumeric(identifier)) {
                    user = yield this.userService.findByUsername(identifier);
                }
                //Is it an email?
                else if (stringutils_1.StringUtils.isEmail(identifier)) {
                    user = yield this.userService.findByEmail(identifier);
                }
                if (user != null) {
                    response.status(HttpStatusCodes.OK).json({
                        id: user.id,
                        username: user.username,
                        stats: user.stats
                    });
                }
                else {
                    response.sendStatus(HttpStatusCodes.NOT_FOUND);
                }
            }
            catch (error) {
                new errorhandler_1.ErrorHandler(error)
                    .catch(argumenterror_1.ArgumentError, (aError) => {
                    response.status(HttpStatusCodes.BAD_REQUEST)
                        .json(new servererrorinfo_1.ServerErrorInfo(1, aError.message));
                })
                    .otherwiseRaise();
            }
        });
    }
};
__decorate([
    body_1.body(userregistration_1.UserRegistration),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserHandler.prototype, "registerNewUser", null);
UserHandler = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(ioctypes_1.IOC_TYPES.AuthService)),
    __param(1, inversify_1.inject(ioctypes_1.IOC_TYPES.UserService)),
    __param(2, inversify_1.inject(ioctypes_1.IOC_TYPES.AccountService)),
    __metadata("design:paramtypes", [Object, Object, iaccountservice_1.IAccountService])
], UserHandler);
exports.UserHandler = UserHandler;
//# sourceMappingURL=userhandler.js.map