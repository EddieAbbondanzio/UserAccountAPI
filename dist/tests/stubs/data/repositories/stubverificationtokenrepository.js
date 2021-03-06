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
 * Only used to test the BLL.
 */
class StubVerificationTokenRepository {
    /**
     * Create a new stub repo.
     */
    constructor() {
        this.verificationTokens = [];
    }
    /**
     * Searches for a user's validation token.
     * @param user The user to look for a validation token for.
     * @returns The token found (or null).
     */
    findByUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (user == null) {
                throw new nullargumenterror_1.NullArgumentError('user');
            }
            else if (isNaN(user.id)) {
                throw new argumenterror_1.ArgumentError('user', 'does not have an id');
            }
            return this.verificationTokens.find(t => t.user == user);
        });
    }
    /**
     * Add a new validation token to the database.
     * @param verificationToken The token to add to the database.
     */
    add(verificationToken) {
        return __awaiter(this, void 0, void 0, function* () {
            if (verificationToken == null) {
                throw new nullargumenterror_1.NullArgumentError('verificationToken');
            }
            if (this.verificationTokens.find(t => t.user == verificationToken.user)) {
                throw new duplicateentityerror_1.DuplicateEntityError('A reset token for the user already exists');
            }
        });
    }
    /**
     * Delete an existing validation token from the database.
     * @param validationtoken The validation token to delete.
     */
    delete(verificationToken) {
        return __awaiter(this, void 0, void 0, function* () {
            if (verificationToken == null) {
                throw new nullargumenterror_1.NullArgumentError('verificationToken');
            }
            let index = this.verificationTokens.findIndex(t => t.user == verificationToken.user);
            if (index != -1) {
                this.verificationTokens.splice(index, 1);
            }
        });
    }
}
exports.StubVerificationTokenRepository = StubVerificationTokenRepository;
//# sourceMappingURL=stubverificationtokenrepository.js.map