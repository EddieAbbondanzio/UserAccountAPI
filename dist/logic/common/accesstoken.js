"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * An access token the user is given so they can use the
 * restricted portion of the API.
 */
class AccessToken {
    /**
     * Create a new access token.
     * @param userId The user's unique id.
     * @param loginCode Their login's unique code.
     * @param bearerToken The JWT.
     */
    constructor(userId, loginCode, bearerToken) {
        this.userId = userId;
        this.loginCode = loginCode;
        this.bearerToken = bearerToken;
    }
}
exports.AccessToken = AccessToken;
//# sourceMappingURL=accesstoken.js.map