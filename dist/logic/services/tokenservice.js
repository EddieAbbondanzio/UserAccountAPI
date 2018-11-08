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
var AccessTokenService_1;
const JsonWebToken = require("jsonwebtoken");
const servicetype_1 = require("../common/servicetype");
const nullargumenterror_1 = require("../../common/error/types/nullargumenterror");
const authenticationerror_1 = require("../../common/error/types/authenticationerror");
const errorhandler_1 = require("../../common/error/errorhandler");
const accesstoken_1 = require("../common/accesstoken");
const inversify_1 = require("inversify");
const ioctypes_1 = require("../../common/ioc/ioctypes");
const config_1 = require("../../config/config");
/**
 * Service to encode and validate payloads through the use
 * of Json Web Tokens.
 */
let AccessTokenService = AccessTokenService_1 = class AccessTokenService {
    /**
     * Create a new token service.
     * @param signature The signature to use to sign tokens with.
     */
    constructor(config) {
        /**
         * The type of service it is.
         */
        this.serviceType = servicetype_1.ServiceType.Token;
        if (config.tokenSignature == null) {
            throw new nullargumenterror_1.NullArgumentError('signature');
        }
        this.signOptions = {
            algorithm: 'HS256',
            expiresIn: AccessTokenService_1.TOKEN_LIFESPAN
        };
        this.verifyOptions = {
            algorithms: ['HS256']
        };
        this.signature = config.tokenSignature;
    }
    /**
     * Issue a new access token using the user login provided.
     * @param userLogin The user login to create a token for.
     * @returns The generated token.
     */
    issueToken(userLogin) {
        return __awaiter(this, void 0, void 0, function* () {
            //Check for a payload
            if (userLogin == null) {
                throw new nullargumenterror_1.NullArgumentError('userLogin');
            }
            return new Promise((resolve, reject) => {
                //JsonWebToken only allows POJOs as payloads.
                let payload = {
                    userId: userLogin.user.id,
                    loginCode: userLogin.code
                };
                JsonWebToken.sign(payload, this.signature, this.signOptions, (err, token) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(new accesstoken_1.AccessToken(userLogin.user.id, userLogin.code, token));
                    }
                });
            });
        });
    }
    /**
     * Authenticate a token to check if it is actually valid,
     * and extract the payload from it.
     * @param bearerToken The string of the jwt to authenticate.
     * @param constructor The constructor of the object to extract
     * from the payload.
     * @returns The decoded payload.
     */
    authenticateToken(bearerToken) {
        return __awaiter(this, void 0, void 0, function* () {
            if (bearerToken == null) {
                throw new nullargumenterror_1.NullArgumentError('token');
            }
            return new Promise((resolve, reject) => {
                JsonWebToken.verify(bearerToken, this.signature, this.verifyOptions, (error, decoded) => {
                    if (error) {
                        new errorhandler_1.ErrorHandler(error)
                            .catch(JsonWebToken.JsonWebTokenError, (err) => {
                            reject(new authenticationerror_1.AuthenticationError(err.message));
                        })
                            .otherwiseRaise();
                    }
                    else {
                        if (decoded.userId == null || decoded.loginCode == null) {
                            throw new TypeError('Invalid token');
                        }
                        resolve(new accesstoken_1.AccessToken(decoded.userId, decoded.loginCode, bearerToken));
                    }
                });
            });
        });
    }
};
/**
 * Tokens are good for 6 months.
 */
AccessTokenService.TOKEN_LIFESPAN = 15780000;
AccessTokenService = AccessTokenService_1 = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(ioctypes_1.IOC_TYPES.Config)),
    __metadata("design:paramtypes", [config_1.Config])
], AccessTokenService);
exports.AccessTokenService = AccessTokenService;
//# sourceMappingURL=tokenservice.js.map