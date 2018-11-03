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
const JsonWebToken = require("jsonwebtoken");
const servicetype_1 = require("../common/servicetype");
const nullargumenterror_1 = require("../../common/error/types/nullargumenterror");
const authenticationerror_1 = require("../../common/error/types/authenticationerror");
const errorhandler_1 = require("../../common/error/errorhandler");
/**
 * Service to encode and validate payloads through the use
 * of Json Web Tokens.
 */
class TokenService {
    /**
     * Create a new token service.
     * @param signature The signature to use to sign tokens with.
     */
    constructor(signature) {
        /**
         * The type of service it is.
         */
        this.serviceType = servicetype_1.ServiceType.Token;
        if (signature == null) {
            throw new nullargumenterror_1.NullArgumentError('signature');
        }
        this.signOptions = {
            algorithm: 'HS256',
            expiresIn: TokenService.TOKEN_LIFESPAN
        };
        this.verifyOptions = {
            algorithms: ['HS256']
        };
        this.signature = signature;
    }
    /**
     * Issue a token that contains the provided payload within it.
     * Don't send out anything secret as the contents can be
     * viewed by the token bearer.
     * @param payload The payload to encode into the JWT.
     * @returns The issued token.
     */
    issueToken(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            //Check for a payload
            if (payload == null) {
                throw new nullargumenterror_1.NullArgumentError('payload');
            }
            return new Promise((resolve, reject) => {
                //JsonWebToken only allows POJOs as payloads.
                let p = Object.assign({}, payload);
                JsonWebToken.sign(p, this.signature, this.signOptions, (err, token) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(token);
                    }
                });
            });
        });
    }
    /**
     * Authenticate a token to check if it is actually valid,
     * and extract the payload from it.
     * @param token The string of the jwt to authenticate.
     * @param constructor The constructor of the object to extract
     * from the payload.
     * @returns The decoded payload.
     */
    authenticateToken(token, constructor) {
        return __awaiter(this, void 0, void 0, function* () {
            if (token == null) {
                throw new nullargumenterror_1.NullArgumentError('token');
            }
            return new Promise((resolve, reject) => {
                JsonWebToken.verify(token, this.signature, this.verifyOptions, (error, decoded) => {
                    if (error) {
                        new errorhandler_1.ErrorHandler(error)
                            .catch(JsonWebToken.JsonWebTokenError, (err) => {
                            reject(new authenticationerror_1.AuthenticationError(err.message));
                        })
                            .otherwiseRaise();
                    }
                    else {
                        let payload = new constructor();
                        for (let p in payload) {
                            if (payload.hasOwnProperty(p)) {
                                if (decoded.hasOwnProperty(p)) {
                                    payload[p] = decoded[p];
                                }
                                else {
                                    reject(new TypeError('Payload is missing property: ' + p));
                                }
                            }
                        }
                        resolve(payload);
                    }
                });
            });
        });
    }
}
/**
 * Tokens are good for 6 months.
 */
TokenService.TOKEN_LIFESPAN = 15780000;
exports.TokenService = TokenService;
//# sourceMappingURL=tokenservice.js.map