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
const textemail_1 = require("../email/types/textemail");
const resettoken_1 = require("../models/resettoken");
const validationerror_1 = require("../validation/validationerror");
const userupdatevalidator_1 = require("../validation/user/validators/userupdatevalidator");
const userdeletevalidator_1 = require("../validation/user/validators/userdeletevalidator");
const service_1 = require("../common/service");
const servicetype_1 = require("../common/servicetype");
/**
 * The user service for retrieving users from the system.
 */
class UserService extends service_1.Service {
    /**
     * Create a new user service.
     * @param emailService: The service for sending emails.
     */
    constructor(database, emailService) {
        super(database);
        /**
         * The type of service it is.
         */
        this.serviceType = servicetype_1.ServiceType.User;
        this.emailService = emailService;
        this.userUpdateValidator = new userupdatevalidator_1.UserUpdateValidator();
        this.userDeleteValidator = new userdeletevalidator_1.UserDeleteValidator();
    }
    /**
     * User forgot their username and wants it emailed to them.
     * @param email The user's email to send it to.
     */
    emailUserTheirUsername(email) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield this.database.userRepo.findByEmail(email);
            //Only proceed if a user was found.
            if (user) {
                let resetEmail = new textemail_1.TextEmail(user.email, 'No Mans Blocks Username', 'Hi, your username is: ' + user.username);
                yield this.emailService.sendEmail(resetEmail);
            }
        });
    }
    /**
     * User forgot their email and wants a temporary access password
     * emailed to them. This will not remove their existing password.
     * @param username The username of the user to email.
     */
    emailUserResetToken(username) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield this.database.userRepo.findByUsername(username);
            //Only send an email if a user was found.
            if (user) {
                //Generate them a reset token.
                let rToken = new resettoken_1.ResetToken(user);
                yield this.database.resetTokenRepo.add(rToken);
                let resetEmail = new textemail_1.TextEmail(user.email, 'No Mans Blocks Password Reset', 'Hi, your password reset code is: ' + rToken.code);
                yield this.emailService.sendEmail(resetEmail);
            }
        });
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
            return this.database.userRepo.isUsernameAvailable(username);
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
            if (!username) {
                throw new Error('No username was passed in');
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
    findById(id, includeDeleted = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (isNaN(id)) {
                throw new Error('No user id passed in.');
            }
            return this.database.userRepo.findById(id, includeDeleted);
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
            let validatorResult = this.userUpdateValidator.validate(user);
            if (!validatorResult.isValid) {
                throw new validationerror_1.ValidationError('Failed to update user.', validatorResult);
            }
            return this.database.userRepo.update(user);
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
            let validatorResult = this.userDeleteValidator.validate(user);
            if (!validatorResult.isValid) {
                throw new validationerror_1.ValidationError('Failed to delete user.', validatorResult);
            }
            return this.database.userRepo.delete(user);
        });
    }
}
exports.UserService = UserService;
//# sourceMappingURL=userservice.js.map