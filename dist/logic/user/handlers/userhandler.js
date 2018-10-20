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
const models_1 = require("../../../data/models");
const userdeletevalidator_1 = require("../../validation/user/validators/userdeletevalidator");
const userupdatevalidator_1 = require("../../validation/user/validators/userupdatevalidator");
const validationerror_1 = require("../../validation/validationerror");
/**
 * Handler related to users. Manages users such as finding,
 * removing, or updating them.
 */
class UserHandler extends logichandler_1.LogicHandler {
    /**
     * Create a new user handler for managing users.
     * @param connection The database connection.
     * @param serviceLocator The dependency locator.
     */
    constructor(connection, serviceLocator) {
        super(connection, serviceLocator);
        this.userRepo = connection.getCustomRepository(models_1.UserRepository);
        this.updateValidator = new userupdatevalidator_1.UserUpdateValidator();
        this.deleteValidator = new userdeletevalidator_1.UserDeleteValidator();
    }
    /**
     * Checks if a username is available for taking.s
     * @param username The username to check for.
     * @returns True if the username is available.
     */
    isUsernameAvailable(username) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!username) {
                throw new Error('No username was passed in.');
            }
            return this.userRepo.isUsernameAvailable(username);
        });
    }
    /**
     * Check if an email is already in use by a non-deleted
     * user.
     * @param email The email to check.
     * @returns True if the email is being used.
     */
    isEmailInUser(email) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!email) {
                throw new Error('No email was passed in.');
            }
            return this.userRepo.isEmailInUse(email);
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
            if (!username) {
                throw new Error('No username was passed in');
            }
            return this.userRepo.findByUsername(username, includeDeleted);
        });
    }
    /**
     * Search for a user by their unique id. This is primarily for
     * API calls.
     * @param id The numeric id of the user to look for.
     * @param includeDeleted If we should include deleted users in the results.
     * @returns The user if found.
     */
    findById(id, includeDeleted = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (isNaN(id)) {
                throw new Error('No user id passed in.');
            }
            return this.userRepo.findById(id, includeDeleted);
        });
    }
    /**
     * Update an existing user in the database.
     * @param user The user to update
     * @returns True if no errors occured.
     */
    update(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!user || isNaN(user.id)) {
                throw new Error('No user passed in, or user has no id.');
            }
            let validatorResult = this.updateValidator.validate(user);
            if (!validatorResult.isValid) {
                throw new validationerror_1.ValidationError('Failed to update user.', validatorResult);
            }
            return this.userRepo.update(user);
        });
    }
    /**
     * Delete a user from the database
     * @param user The user to delete
     * @returns True if no errors occured.
     */
    delete(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!user || isNaN(user.id)) {
                throw new Error('No user passed in, or user has no id.');
            }
            let validatorResult = this.deleteValidator.validate(user);
            if (!validatorResult.isValid) {
                throw new validationerror_1.ValidationError('Failed to delete user.', validatorResult);
            }
            return this.userRepo.delete(user);
        });
    }
}
exports.UserHandler = UserHandler;
//# sourceMappingURL=userhandler.js.map