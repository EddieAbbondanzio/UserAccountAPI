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
const logichandler_1 = require("../../common/logichandler");
/**
 * Business logic for resetting or updating user passwords.
 */
class PasswordHandler extends logichandler_1.LogicHandler {
    /**
     * Create a new password handler.
     * @param connection The database connection.
     * @param serviceLocator The depedency locator.
     */
    constructor(connection, serviceLocator) {
        super(connection, serviceLocator);
    }
    /**
     * Reset a user's password after verifying their token is valid.
     * @param username The username of the user.
     * @param passwordToken Their temporary access password.
     * @param newPassword Their new desired password.
     * @returns True if the token was valid.
     */
    resetPassword(username, passwordToken, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            return false;
        });
    }
    /**
     * Update a user's password. This only proceeds if their current
     * password passed in is valid.
     * @param username The username of the user.
     * @param currPassword Their current password.
     * @param newPassword Their new desired password.
     * @returns True if successful.
     */
    updatePassword(username, currPassword, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            return false;
        });
    }
}
exports.PasswordHandler = PasswordHandler;

//# sourceMappingURL=passwordhandler.js.map
