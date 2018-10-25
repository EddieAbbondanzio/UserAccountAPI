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
class StubUserLoginRepository {
    /**
     * Create a new stub repo.
     */
    constructor() {
        this.logins = [];
    }
    /**
     * Search for a login for a specific user.
     * @param user The user to look for a login for.
     * @returns The login found (or null).
     */
    findByUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (user == null) {
                throw new nullargumenterror_1.NullArgumentError('user');
            }
            else if (isNaN(user.id)) {
                throw new argumenterror_1.ArgumentError('user', 'does not have an id');
            }
            return this.logins.find(l => l.user == user);
        });
    }
    /**
     * Add a new user login to the database.
     * @param userLogin The userlogin to add to the database.
     */
    add(userLogin) {
        return __awaiter(this, void 0, void 0, function* () {
            if (userLogin == null) {
                throw new nullargumenterror_1.NullArgumentError('userLogin');
            }
            if (this.logins.find(l => l.user == userLogin.user)) {
                throw new duplicateentityerror_1.DuplicateEntityError('A login for the user already exists');
            }
            this.logins.push(userLogin);
        });
    }
    /**
     * Remove an existing login from the database.
     * @param userlogin The userlogin to remove from the database.
     */
    delete(userlogin) {
        return __awaiter(this, void 0, void 0, function* () {
            if (userlogin == null) {
                throw new nullargumenterror_1.NullArgumentError('userLogin');
            }
            let index = this.logins.findIndex(l => l.user == userlogin.user);
            if (index != -1) {
                this.logins.splice(index, 1);
            }
        });
    }
}
exports.StubUserLoginRepository = StubUserLoginRepository;
//# sourceMappingURL=stubuserloginrepository.js.map