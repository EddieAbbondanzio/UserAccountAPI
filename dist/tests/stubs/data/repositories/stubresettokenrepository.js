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
const nullargumenterror_1 = require("../../../../common/errors/nullargumenterror");
const argumenterror_1 = require("../../../../common/errors/argumenterror");
const duplicateentityerror_1 = require("../../../../common/errors/duplicateentityerror");
/**
 * Stub repository for faking CRUD operations with a 'database'.
 * Only used for unit testing the BLL.
 */
class StubResetTokenRepository {
    /**
     * Create a new stub repo.
     */
    constructor() {
        this.resetTokens = [];
    }
    /**
     * Search for a token via their user.
     * @param user The user to look for a reset token for.
     * @returns The token of the user.
     */
    findByUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (user == null) {
                throw new nullargumenterror_1.NullArgumentError('user');
            }
            else if (isNaN(user.id)) {
                throw new argumenterror_1.ArgumentError('user', 'does not have an id');
            }
            return this.resetTokens.find(t => t.user == user);
        });
    }
    /**
     * Add a new reset token to the database.
     * @param resetToken The token to add to the database.
     * @returns True if no errors.
     */
    add(resetToken) {
        return __awaiter(this, void 0, void 0, function* () {
            if (resetToken == null) {
                throw new nullargumenterror_1.NullArgumentError('resetToken');
            }
            if (this.resetTokens.find(t => t.user == resetToken.user) != null) {
                throw new duplicateentityerror_1.DuplicateEntityError('A reset token for the user already exists');
            }
            this.resetTokens.push(resetToken);
        });
    }
    /**
     * Delete an existing reset token from the database.
     * @param resetToken The reset token to delete.
     * @returns True if no errors.
     */
    delete(resetToken) {
        return __awaiter(this, void 0, void 0, function* () {
            if (resetToken == null) {
                throw new nullargumenterror_1.NullArgumentError('resetToken');
            }
            let index = this.resetTokens.findIndex(t => t.user == resetToken.user);
            if (index != -1) {
                this.resetTokens.splice(index, 1);
            }
        });
    }
}
exports.StubResetTokenRepository = StubResetTokenRepository;
//# sourceMappingURL=stubresettokenrepository.js.map