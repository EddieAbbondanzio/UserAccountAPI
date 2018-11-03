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
const nullargumenterror_1 = require("../../common/error/types/nullargumenterror");
const argumenterror_1 = require("../../common/error/types/argumenterror");
const errorhandler_1 = require("../../common/error/errorhandler");
const authenticationerror_1 = require("../../common/error/types/authenticationerror");
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
        if (stringutils_1.StringUtils.isEmpty(secretKey)) {
            throw new argumenterror_1.ArgumentError('secretKey');
        }
        this.signOptions = {
            algorithm: 'HS256',
            expiresIn: TokenManager.TOKEN_LIFESPAN
        };
        this.verifyOptions = {
            algorithms: ['HS256']
        };
        this.secretKey = secretKey;
        TokenManager.instance = this;
    }
    /**
     * Issue a new token for a specific user. This
     * puts their user id in the token for later
     * retrieval.
     * @param User The user to issue a token for.
     */
    issueToken(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (user == null) {
                throw new nullargumenterror_1.NullArgumentError('user');
            }
            else if (isNaN(user.id)) {
                throw new argumenterror_1.ArgumentError('user', 'has no id');
            }
            /*
            * DO NOT CHANGE THIS TO A TOKENPAYLOAD.
            * You'll throw errors and waste time hunting
            * them down....
            */
            let payload = { id: user.id };
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
    authenticateToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!token) {
                throw new nullargumenterror_1.NullArgumentError('token');
            }
            return new Promise((resolve, reject) => {
                JWT.verify(token, this.secretKey, this.verifyOptions, (error, decoded) => {
                    if (error) {
                        new errorhandler_1.ErrorHandler(error)
                            .catch(JWT.JsonWebTokenError, (err) => {
                            reject(new authenticationerror_1.AuthenticationError(err.message));
                        })
                            .otherwiseRaise();
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