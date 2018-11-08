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
const authenticationerror_1 = require("../../common/error/types/authenticationerror");
const userlogin_1 = require("../models/userlogin");
const database_1 = require("../common/database");
const servicetype_1 = require("../common/servicetype");
const databaseservice_1 = require("../common/databaseservice");
const nullargumenterror_1 = require("../../common/error/types/nullargumenterror");
const inversify_1 = require("inversify");
const ioctypes_1 = require("../../common/ioc/ioctypes");
/**
 * The authentication service of the system. This handles registering,
 * logging in, or updating user's passwords.
 */
let AuthService = class AuthService extends databaseservice_1.DatabaseService {
    /**
     * Create a new authentication service.
     * @param database The current database.
     * @param tokenService The JWT manager.
     * @param emailSender The email sender service.
     */
    constructor(database, tokenService, emailSender) {
        super(database);
        /**
         * The type of service it is.
         */
        this.serviceType = servicetype_1.ServiceType.Auth;
        this.tokenService = tokenService;
    }
    /**
     * Login a user via their credentials.
     * @param username The user's username.
     * @param password The user's password.
     * @returns An access token if successful.
     */
    loginUserViaCredentials(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            //Check for good inputs.
            if (username == null) {
                throw new nullargumenterror_1.NullArgumentError('username');
            }
            else if (password == null) {
                throw new nullargumenterror_1.NullArgumentError('password');
            }
            //Pull in the user from the database.
            let user = yield this.database.userRepo.findByUsername(username);
            //If no user found, or bad password crash and burn.
            if (user == null || !(yield user.validatePassword(password))) {
                throw new authenticationerror_1.AuthenticationError('Failed login attempt');
            }
            return this.loginUser(user);
        });
    }
    /**
     * Relogin a user using the access token they provided. This
     * will invalidate their current token and give them a new one.
     * @param bearerToken The current bearer token.
     * @returns A refreshed access token if successful.
     */
    loginUserViaToken(bearerToken) {
        return __awaiter(this, void 0, void 0, function* () {
            if (bearerToken == null) {
                throw new nullargumenterror_1.NullArgumentError('bearerToken');
            }
            //Authenticate the token, then pull in the user.
            let accessToken = yield this.tokenService.authenticateToken(bearerToken);
            let user = yield this.database.userRepo.findById(accessToken.userId);
            //Try to find the login in the DB. This is how we can invalidate JWTs
            let userLogin = yield this.database.loginRepo.findByUser(accessToken.userId);
            return userLogin == null ? null : this.loginUser(user);
        });
    }
    /**
     * Log in a user.
     * @param user The user to log in.
     * @returns Their access token.
     */
    loginUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (user == null) {
                throw new nullargumenterror_1.NullArgumentError('user');
            }
            try {
                yield this.database.startTransaction();
                //Delete out any old ones
                yield this.database.loginRepo.deleteForUser(user);
                //Issue them a login, and save it.
                let login = new userlogin_1.UserLogin(user);
                yield this.database.loginRepo.add(login);
                yield this.database.commitTransaction();
                //Return a JWT for them
                return this.tokenService.issueToken(login);
            }
            catch (error) {
                if (this.database.isInTransaction()) {
                    yield this.database.rollbackTransaction();
                }
                throw error;
            }
        });
    }
    /**
     * Log out a user by invalidating their JWT.
     * @param user The user to log out.
     */
    logoutUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (user == null) {
                throw new nullargumenterror_1.NullArgumentError('user');
            }
            yield this.database.loginRepo.deleteForUser(user);
        });
    }
    /**
     * Validate that a user is who they claim to be. This will check their username
     * against the login provided in the database.
     * @param user The user to validate.
     * @param loginCode Their login guid.
     */
    validateLogin(user, loginCode) {
        return __awaiter(this, void 0, void 0, function* () {
            if (user == null) {
                throw new nullargumenterror_1.NullArgumentError('user');
            }
            //Try to find the login.
            let userLogin = yield this.database.loginRepo.findByUser(user);
            //Did we find one, and is the code accurate?
            return userLogin != null && userLogin.code == loginCode;
        });
    }
};
AuthService = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(ioctypes_1.IOC_TYPES.Database)),
    __param(1, inversify_1.inject(ioctypes_1.IOC_TYPES.TokenService)),
    __param(2, inversify_1.inject(ioctypes_1.IOC_TYPES.EmailSender)),
    __metadata("design:paramtypes", [database_1.Database, Object, Object])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=authservice.js.map