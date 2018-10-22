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
const JWT = require("jsonwebtoken");
const stringutils_1 = require("../../util/stringutils");
const tokenpayload_1 = require("../common/tokenpayload");
/**
 * Handles issuing and verifying jwt tokens to users. Use
 * this with the loginservice, and registerservice for authentication.
 */
class TokenManager {
    /**
     * Create a new token manager for handing
     * out and verifying tokens.
     * @param secretKey The secret encryption key.
     */
    constructor(secretKey) {
        console.log('Secret key is: ', secretKey);
        if (stringutils_1.StringUtils.isEmpty(secretKey)) {
            throw new Error('A secret key is required!');
        }
        this.signOptions = {
            algorithm: 'HS256',
            expiresIn: TokenManager.TOKEN_LIFESPAN
        };
        this.verifyOptions = {
            algorithms: ['HS256']
        };
        this.secretKey = secretKey;
    }
    /**
     * Issue a new token for a specific user. This
     * puts their user id in the token for later
     * retrieval.
     * @param User The user to issue a token for.
     */
    issueToken(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!user || isNaN(user.id)) {
                throw new Error('No user passed in, or id is missing!');
            }
            //The payload we want to pack in the JWT.
            let payload = {
                userId: user.id
            };
            return new Promise((resolve, reject) => {
                JWT.sign(payload, this.secretKey, this.signOptions, (error, token) => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(token);
                    }
                });
            });
        });
    }
    /**
     * Verify a JWT to see if the sender is authorized
     * or not. If the token is successfully verified the user's
     * id is returned.
     * @param token The JWT to verify.
     */
    verifyToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!token) {
                throw new Error('AuthenticationService.issueToken(): No token passed in!');
            }
            return new Promise((resolve, reject) => {
                JWT.verify(token, this.secretKey, this.verifyOptions, (error, decoded) => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        let payload = new tokenpayload_1.TokenPayload(parseInt(decoded.userId, 10));
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
TokenManager.TOKEN_LIFESPAN = 15780000;
exports.TokenManager = TokenManager;
//# sourceMappingURL=tokenmanager.js.map