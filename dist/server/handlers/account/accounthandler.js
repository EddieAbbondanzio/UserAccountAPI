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
const forgotusernamepayload_1 = require("./payloads/forgotusernamepayload");
const servererrorcode_1 = require("../../common/servererrorcode");
const servererrorinfo_1 = require("../../common/servererrorinfo");
const forgotpasswordpayload_1 = require("./payloads/forgotpasswordpayload");
const body_1 = require("../../common/decorators/body");
const emailverificationpayload_1 = require("./payloads/emailverificationpayload");
const passwordresetpayload_1 = require("./payloads/passwordresetpayload");
const passwordupdatepayload_1 = require("./payloads/passwordupdatepayload");
const authenticate_1 = require("../../common/decorators/authenticate");
const errorhandler_1 = require("../../../common/error/errorhandler");
const authenticationerror_1 = require("../../../common/error/types/authenticationerror");
const userupdate_1 = require("./payloads/userupdate");
/**
 * Handler for updating the user's own account.
 */
class AccountHandler {
    /**
     * Create a new account handler.
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
        this.expressRouter.post('/forgotusername/', (req, res) => __awaiter(this, void 0, void 0, function* () { return this.forgotUsername(req, res); }));
        this.expressRouter.post('/forgotpassword/', (req, res) => __awaiter(this, void 0, void 0, function* () { return this.forgotPassword(req, res); }));
        this.expressRouter.post('/password/', (req, res) => __awaiter(this, void 0, void 0, function* () { return this.resetPassword(req, res); }));
        this.expressRouter.put('/password/', (req, res) => __awaiter(this, void 0, void 0, function* () { return this.updatePassword(req, res); }));
        this.expressRouter.put('/verifyemail/', (req, res) => __awaiter(this, void 0, void 0, function* () { return this.resendVerificationEmail(req, res); }));
        this.expressRouter.post('/verifyemail/', (req, res) => __awaiter(this, void 0, void 0, function* () { return this.verifyEmail(req, res); }));
        this.expressRouter.post('/', (req, res) => __awaiter(this, void 0, void 0, function* () { return this.updateUser(req, res); }));
        this.expressRouter.delete('/', (req, res) => __awaiter(this, void 0, void 0, function* () { return this.deleteUser(req, res); }));
        expressApp.use('/account/', this.expressRouter);
    }
    /**
     * Handle an incoming request to update a user.
     * @param request The incoming request to work with.
     * @param response The outgoing response being built.
     */
    updateUser(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            request.user.name = request.body.name;
            request.user.email = request.body.email;
            try {
                yield this.userService.update(request.user);
                response.sendStatus(HttpStatusCodes.OK);
            }
            catch (error) {
                console.log(error);
                response.sendStatus(HttpStatusCodes.INTERNAL_SERVER_ERROR);
            }
        });
    }
    /**
     * Handle an incoming request to delete a user.
     * @param request The incoming request to work with.
     * @param response The outgoing response being built.
     */
    deleteUser(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.userService.delete(request.user);
            }
            catch (error) {
                console.log(error);
                response.sendStatus(HttpStatusCodes.INTERNAL_SERVER_ERROR);
            }
        });
    }
    /**
     * User forgot their username, and wants it to be emailed to them.
     * @param request The incoming request to process.
     * @param response The outgoing response being built.
     */
    forgotUsername(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.authService.emailUserTheirUsername(request.body.username);
            }
            catch (error) {
                console.log('An error occured requesting a forgotten username: ', error);
                response.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
                    .json(new servererrorinfo_1.ServerErrorInfo(servererrorcode_1.ServerErrorCode.Unknown));
            }
        });
    }
    /**
     * User forgot their password, and wants to reset it. This will email
     * them a reset verification code to use.
     * @param request The incoming request to process.
     * @param response The outgoing response being built.
     */
    forgotPassword(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.authService.emailUserResetToken(request.body.username);
            }
            catch (error) {
                console.log('An error occured requesting a forgotten username: ', error);
                response.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
                    .json(new servererrorinfo_1.ServerErrorInfo(servererrorcode_1.ServerErrorCode.Unknown));
            }
        });
    }
    /**
     * Process a request to update a user's password. This checks for a
     * bearer token, and their current password.
     * @param request The incoming request to process.
     * @param response The outgoing response being built.
     */
    updatePassword(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.authService.updatePassword(request.user, request.body.currentPassword, request.body.newPassword);
                response.sendStatus(HttpStatusCodes.OK);
            }
            catch (error) {
                new errorhandler_1.ErrorHandler(error)
                    .catch(authenticationerror_1.AuthenticationError, (error) => {
                    response.status(HttpStatusCodes.UNAUTHORIZED)
                        .json(new servererrorinfo_1.ServerErrorInfo(servererrorcode_1.ServerErrorCode.InvalidAuthentication));
                })
                    .otherwise((error) => {
                    console.log('An error occured updating a password: ', error);
                    response.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
                        .json(new servererrorinfo_1.ServerErrorInfo(servererrorcode_1.ServerErrorCode.Unknown));
                });
            }
        });
    }
    /**
     * Process a request to reset a user's password. This expects a bearer
     * token, their reset code, and a new password.
     * @param request The incoming request to process.
     * @param response The outgoing response being built.
     */
    resetPassword(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.authService.resetPassword(request.user, request.body.resetCode, request.body.newPassword);
                response.status(HttpStatusCodes.OK);
            }
            catch (error) {
                new errorhandler_1.ErrorHandler(error)
                    .catch(authenticationerror_1.AuthenticationError, (error) => {
                    response.sendStatus(HttpStatusCodes.UNAUTHORIZED);
                })
                    .otherwise((error) => {
                    console.log('An error occcured reseting a password: ', error);
                    response.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
                        .json(new servererrorinfo_1.ServerErrorInfo(servererrorcode_1.ServerErrorCode.Unknown));
                });
            }
        });
    }
    /**
     * Verify a user's email. This will check their verification code
     * provided with the one they were emailed. This also expects a
     * JWT.
     * @param request The incoming request to process.
     * @param response The outgoing response being built.
     */
    verifyEmail(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let success = yield this.authService.verifyUserEmail(request.user, request.body.verificationCode);
                if (success) {
                    response.sendStatus(HttpStatusCodes.OK);
                }
                else {
                    response.sendStatus(HttpStatusCodes.BAD_REQUEST);
                }
            }
            catch (error) {
                console.log('An error occured registering a user: ', error);
                response.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
                    .json(new servererrorinfo_1.ServerErrorInfo(servererrorcode_1.ServerErrorCode.Unknown));
            }
        });
    }
    /**
     * Resend the user their verification email. This expects the user
     * to provide their JWT.
     * @param request The incoming request to process.
     * @param response The outgoing response being built.
     */
    resendVerificationEmail(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.authService.resendVerificationEmail(request.user);
                response.sendStatus(HttpStatusCodes.OK);
            }
            catch (error) {
                console.log('An error occured registering a user: ', error);
                response.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
                    .json(new servererrorinfo_1.ServerErrorInfo(servererrorcode_1.ServerErrorCode.Unknown));
            }
        });
    }
}
__decorate([
    authenticate_1.authenticate(),
    body_1.body(userupdate_1.UserUpdate),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AccountHandler.prototype, "updateUser", null);
__decorate([
    authenticate_1.authenticate(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AccountHandler.prototype, "deleteUser", null);
__decorate([
    body_1.body(forgotusernamepayload_1.ForgotUsernamePayload),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AccountHandler.prototype, "forgotUsername", null);
__decorate([
    body_1.body(forgotpasswordpayload_1.ForgotPasswordPayload),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AccountHandler.prototype, "forgotPassword", null);
__decorate([
    authenticate_1.authenticate(),
    body_1.body(passwordupdatepayload_1.PasswordUpdatePayload),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AccountHandler.prototype, "updatePassword", null);
__decorate([
    authenticate_1.authenticate(),
    body_1.body(passwordresetpayload_1.PasswordResetPayload),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AccountHandler.prototype, "resetPassword", null);
__decorate([
    authenticate_1.authenticate(),
    body_1.body(emailverificationpayload_1.EmailVerificationPayload),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AccountHandler.prototype, "verifyEmail", null);
__decorate([
    authenticate_1.authenticate(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AccountHandler.prototype, "resendVerificationEmail", null);
exports.AccountHandler = AccountHandler;
//# sourceMappingURL=accounthandler.js.map