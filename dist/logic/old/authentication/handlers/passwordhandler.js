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
const authenticationerror_1 = require("../common/authenticationerror");
const models_1 = require("../../../data/models");
const idataaccesslayer_1 = require("../../../data/common/idataaccesslayer");
/**
 * Business logic for resetting or updating user passwords.
 */
class PasswordHandler extends logichandler_1.LogicHandler {
    /**
     * Create a new password handler.
     * @param serviceLocator The depedency locator.
     */
    constructor(serviceLocator) {
        super(serviceLocator);
        this.userRepo = idataaccesslayer_1.DataAccessLayer.current.userRepo;
        this.resetTokenRepo = idataaccesslayer_1.DataAccessLayer.current.resetTokenRepo;
    }
    /**
     * Reset a user's password after verifying their token is valid.
     * @param user The user.
     * @param resetCode Their temporary access password.
     * @param newPassword Their new desired password.
     * @returns True if the token was valid.
     */
    resetPassword(user, resetCode, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!user) {
                throw new Error('No user passed in');
            }
            //Need to pull in the reset token for them.
            let resetToken = yield this.resetTokenRepo.findByUser(user);
            if (resetToken && resetToken.code == resetCode) {
                yield user.setPassword(newPassword);
                //Don't want to fail to update the user but revoke their reset token.
                return yield this.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                    let rTokenRepo = manager.getCustomRepository(ResetTokenRespository);
                    let userRepo = manager.getCustomRepository(models_1.UserRepository);
                    yield Promise.all([rTokenRepo.delete(resetToken, manager), userRepo.updatePassword(user, manager)]);
                    return true;
                }));
            }
            return false;
        });
    }
    /**
     * Update a user's password. This only proceeds if their current
     * password passed in is valid.
     * @param user The user to update.
     * @param currPassword Their current password.
     * @param newPassword Their new desired password.
     * @returns True if successful.
     */
    updatePassword(user, currPassword, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!user) {
                throw new Error('No user passed in.');
            }
            if (!(yield user.validatePassword(currPassword))) {
                throw new authenticationerror_1.AuthenticationError('Invalid password.');
            }
            //Gotta update the password before we can update the user in the db.
            yield user.setPassword(newPassword);
            yield this.userRepo.updatePassword(user);
            return false;
        });
    }
}
exports.PasswordHandler = PasswordHandler;
//# sourceMappingURL=passwordhandler.js.map