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
const validationerror_1 = require("../validation/validationerror");
const userupdatevalidator_1 = require("../validation/user/validators/userupdatevalidator");
const userdeletevalidator_1 = require("../validation/user/validators/userdeletevalidator");
const servicetype_1 = require("../common/servicetype");
const argumenterror_1 = require("../../common/error/types/argumenterror");
const stringutils_1 = require("../../util/stringutils");
const usernamevalidatorrule_1 = require("../validation/user/rules/usernamevalidatorrule");
const nullargumenterror_1 = require("../../common/error/types/nullargumenterror");
const usernamevalidator_1 = require("../validation/user/validators/usernamevalidator");
const databaseservice_1 = require("../common/databaseservice");
/**
 * The user service for retrieving users from the system.
 */
class UserService extends databaseservice_1.DatabaseService {
    /**
     * Create a new user service.
     * @param database The current database.
     */
    constructor(database) {
        super(database);
        /**
         * The type of service it is.
         */
        this.serviceType = servicetype_1.ServiceType.User;
        this.userUpdateValidator = new userupdatevalidator_1.UserUpdateValidator();
        this.userDeleteValidator = new userdeletevalidator_1.UserDeleteValidator();
    }
    /**
     * Checks if a username is available for taking.s
     * @param username The username to check for.
     * @returns True if the username is available.
     */
    isUsernameAvailable(username) {
        return __awaiter(this, void 0, void 0, function* () {
            let usernameValRule = new usernamevalidatorrule_1.UsernameValidatorRule();
            if (username == null) {
                throw new nullargumenterror_1.NullArgumentError('username');
            }
            else {
                let validatorResult = new usernamevalidator_1.UsernameValidator().validate(username);
                if (validatorResult.isValid) {
                    return this.database.userRepo.isUsernameAvailable(username);
                }
                else {
                    throw new validationerror_1.ValidationError('Username is not valid', validatorResult);
                }
            }
        });
    }
    /**
     * Check if an email is already in use by a non-deleted
     * user.
     * @param email The email to check.
     * @returns True if the email is being used.
     */
    isEmailInUse(email) {
        return __awaiter(this, void 0, void 0, function* () {
            if (email == null) {
                throw new nullargumenterror_1.NullArgumentError('email');
            }
            return this.database.userRepo.isEmailInUse(email);
        });
    }
    /**
     * Search for a user by their username.
     * @param username The username to look for
     * @param includeDeleted If we should include deleted users in the results.
     * @returns The user if found.
     */
    findByUsername(username, includeDeleted) {
        return __awaiter(this, void 0, void 0, function* () {
            if (username == null) {
                throw new nullargumenterror_1.NullArgumentError('username');
            }
            return this.database.userRepo.findByUsername(username, includeDeleted);
        });
    }
    /**
     * Search for a user by their unique id. This is primarily for
     * API calls.
     * @param id The numeric id of the user to look for.
     * @param includeDeleted If we should include deleted users in the results.
     * @returns The user if found.
     */
    findById(id, includeDeleted) {
        return __awaiter(this, void 0, void 0, function* () {
            if (isNaN(id)) {
                throw new argumenterror_1.ArgumentError('id');
            }
            return this.database.userRepo.findById(id, includeDeleted);
        });
    }
    /**
     * Search for a user via their email.
     * @param email The email to look for.
     * @param includeDeleted If deleted users should be included in the result.
     */
    findByEmail(email, includeDeleted) {
        return __awaiter(this, void 0, void 0, function* () {
            if (stringutils_1.StringUtils.isBlank(email)) {
                throw new argumenterror_1.ArgumentError('email');
            }
            return this.database.userRepo.findByEmail(email, includeDeleted);
        });
    }
    /**
     * Update an existing user in the database.
     * @param user The user to update
     */
    update(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!user || isNaN(user.id)) {
                throw new argumenterror_1.ArgumentError('user');
            }
            let validatorResult = this.userUpdateValidator.validate(user);
            if (!validatorResult.isValid) {
                throw new validationerror_1.ValidationError('Failed to update user.', validatorResult);
            }
            yield this.database.userRepo.update(user);
        });
    }
    /**
     * Delete a user from the database
     * @param user The user to delete
     */
    delete(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!user || isNaN(user.id)) {
                throw new argumenterror_1.ArgumentError('user');
            }
            let validatorResult = this.userDeleteValidator.validate(user);
            if (!validatorResult.isValid) {
                throw new validationerror_1.ValidationError('Failed to delete user.', validatorResult);
            }
            yield this.database.userRepo.delete(user);
        });
    }
}
exports.UserService = UserService;
//# sourceMappingURL=userservice.js.map