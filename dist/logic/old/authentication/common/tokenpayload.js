"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The information stored in a user JWT.
 */
class TokenPayload {
    /**
     * Create a new instance of the jWT payload.
     * @param userId The user id of the owner of the JWT.
     */
    constructor(userId) {
        this.userId = userId;
    }
}
exports.TokenPayload = TokenPayload;
//# sourceMappingURL=tokenpayload.js.map