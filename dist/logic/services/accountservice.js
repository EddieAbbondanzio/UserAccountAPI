"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const databaseservice_1 = require("../common/databaseservice");
const servicetype_1 = require("../common/servicetype");
const nullargumenterror_1 = require("../../common/error/types/nullargumenterror");
const textemail_1 = require("../email/types/textemail");
const verificationtoken_1 = require("../models/verificationtoken");
const resettoken_1 = require("../models/resettoken");
const authenticationerror_1 = require("../../common/error/types/authenticationerror");
const argumenterror_1 = require("../../common/error/types/argumenterror");
const validationerror_1 = require("../validation/validationerror");
const userupdatevalidator_1 = require("../validation/user/validators/userupdatevalidator");
const database_1 = require("../common/database");
const inversify_1 = require("inversify");
const ioctypes_1 = require("../../common/ioc/ioctypes");
/**
 * Service for everything related to the user's
 * account.
 */
let AccountService = class AccountService extends databaseservice_1.DatabaseService {
    /**
     * Create a new AccountService for managing the account details
     * of Users.
     * @param database The database to query from.
     * @param emailSender The utility for sending users emails.
     */
    constructor(database, emailSender) {
        super(database);
        /**
         * The type of service it is.
         */
        this.serviceType = servicetype_1.ServiceType.Account;
        this.emailSender = emailSender;
        this.userUpdateValidator = new userupdatevalidator_1.UserUpdateValidator();
    }
    /**
     * Verify a user's email by checking the validation code they gave us.
     * @param user The user whos email we need to validate.
     * @param verificationCode The validation code they provided.
     * @returns True if the code was valid.
     */
    verifyUserEmail(user, verificationCode) {
        return __awaiter(this, void 0, void 0, function* () {
            //Check for good input.
            if (user == null) {
                throw new nullargumenterror_1.NullArgumentError('user');
            }
            else if (verificationCode == null) {
                throw new nullargumenterror_1.NullArgumentError('verifcationCode');
            }
            //Is user already validated?
            if (user.isVerified) {
                return true;
            }
            let vToken = yield this.database.verificationTokenRepo.findByUser(user);
            //Not found, or bad match
            if (vToken == null || vToken.code != verificationCode) {
                return false;
            }
            else {
                user.isVerified = true;
            }
            try {
                yield this.database.startTransaction();
                yield Promise.all([
                    this.database.userRepo.update(user),
                    this.database.verificationTokenRepo.delete(vToken)
                ]);
                yield this.database.commitTransaction();
                return true;
            }
            catch (error) {
                if (this.database.isInTransaction()) {
                    yield this.database.rollbackTransaction();
                }
                throw error;
            }
        });
    }
    /**
     * Reset a user's password after verifying their token is valid.
     * @param user The user.
     * @param resetCode Their temporary access password.
     * @param newPassword Their new desired password.
     */
    resetPassword(user, resetCode, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            if (user == null) {
                throw new nullargumenterror_1.NullArgumentError('user');
            }
            else if (resetCode == null) {
                throw new nullargumenterror_1.NullArgumentError('resetCode');
            }
            else if (newPassword == null) {
                throw new nullargumenterror_1.NullArgumentError('newPassword');
            }
            try {
                //Need to pull in the reset token for them.
                let resetToken = yield this.database.resetTokenRepo.findByUser(user);
                if (resetToken && resetToken.code == resetCode) {
                    yield user.setPassword(newPassword);
                    yield this.database.startTransaction();
                    yield Promise.all([
                        this.database.resetTokenRepo.delete(resetToken),
                        this.database.userRepo.updatePassword(user),
                        this.database.loginRepo.deleteForUser(user)
                    ]);
                    yield this.database.commitTransaction();
                }
                else {
                    throw new authenticationerror_1.AuthenticationError('Incorrect code');
                }
            }
            catch (error) {
                if (this.database.isInTransaction()) {
                    yield this.database.rollbackTransaction();
                }
                throw error;
            }
        });
    }
    /**
     * Update a user's password. This only proceeds if their current
     * password passed in is valid.
     * @param user The user to update.
     * @param currPassword Their current password.
     * @param newPassword Their new desired password.
     */
    updatePassword(user, currPassword, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            if (user == null) {
                throw new nullargumenterror_1.NullArgumentError('user');
            }
            else if (currPassword == null) {
                throw new nullargumenterror_1.NullArgumentError('currPassword');
            }
            else if (newPassword == null) {
                throw new nullargumenterror_1.NullArgumentError('newPassword');
            }
            //Check the password they passed in first.
            if (!(yield user.validatePassword(currPassword))) {
                throw new authenticationerror_1.AuthenticationError('Invalid password.');
            }
            yield user.setPassword(newPassword);
            try {
                yield this.database.startTransaction();
                //Update their password, then remove any logins.
                yield Promise.all([
                    this.database.userRepo.updatePassword(user),
                    this.database.loginRepo.deleteForUser(user)
                ]);
                yield this.database.commitTransaction();
            }
            catch (error) {
                if (this.database.isInTransaction()) {
                    yield this.database.rollbackTransaction();
                }
                throw error;
            }
        });
    }
    /**
     * Update an existing user in the database.
     * @param user The user to update
     */
    updateInfo(user) {
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
     * Send the user their validation code via an email.
     * @param user The user to re email.
     * @param vToken Their validation code.
     */
    sendVerificationEmail(user, vToken) {
        return __awaiter(this, void 0, void 0, function* () {
            if (user == null) {
                throw new nullargumenterror_1.NullArgumentError('user');
            }
            //Don't waste resources sending to deleted, or previously verified.
            if (user.isVerified || user.isDeleted) {
                return;
            }
            //Do we need to issue a token?
            if (vToken == null) {
                vToken = new verificationtoken_1.VerificationToken(user);
                yield this.database.verificationTokenRepo.add(vToken);
            }
            let validationEmail = new textemail_1.TextEmail(user.email, "Account Confirmation", "Thanks for joining! Your confirmation code is: " + vToken.code);
            return this.emailSender.sendEmail(validationEmail);
        });
    }
    /**
     * The user didn't recieve their validation code. Resend them an
     * email with it again.
     * @param user The user to re email.
     */
    resendVerificationEmail(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (user == null) {
                throw new nullargumenterror_1.NullArgumentError('user');
            }
            //User has already been verified.
            if (user.isVerified || user.isDeleted) {
                return;
            }
            let vToken = yield this.database.verificationTokenRepo.findByUser(user);
            //What are we trying to achieve here? No token...
            if (vToken == null) {
                return;
            }
            yield this.sendVerificationEmail(user, vToken);
        });
    }
    /**
     * User forgot their username and wants it emailed to them.
     * @param email The user's email to send it to.
     */
    emailUserTheirUsername(email) {
        return __awaiter(this, void 0, void 0, function* () {
            if (email == null) {
                throw new nullargumenterror_1.NullArgumentError('email');
            }
            let user = yield this.database.userRepo.findByEmail(email);
            //Only proceed if a user was found.
            if (user) {
                let resetEmail = new textemail_1.TextEmail(user.email, 'Forgotten Username', 'Hi, your username is: ' + user.username);
                yield this.emailSender.sendEmail(resetEmail);
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
            if (username == null) {
                throw new nullargumenterror_1.NullArgumentError('username');
            }
            let user = yield this.database.userRepo.findByUsername(username);
            //Only send an email if a user was found.
            if (user) {
                try {
                    yield this.database.startTransaction();
                    //Delete out old ones.
                    yield this.database.resetTokenRepo.deleteForUser(user);
                    //Generate them a reset token.
                    let rToken = new resettoken_1.ResetToken(user);
                    yield this.database.resetTokenRepo.add(rToken);
                    yield this.database.commitTransaction();
                    let resetEmail = new textemail_1.TextEmail(user.email, 'Password Reset', 'Hi, your password reset code is: ' + rToken.code);
                    yield this.emailSender.sendEmail(resetEmail);
                }
                catch (error) {
                    if (this.database.isInTransaction()) {
                        yield this.database.rollbackTransaction();
                    }
                    throw error;
                }
            }
        });
    }
};
AccountService = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(ioctypes_1.IOC_TYPES.Database)),
    __param(1, inversify_1.inject(ioctypes_1.IOC_TYPES.EmailSender)),
    __metadata("design:paramtypes", [database_1.Database, Object])
], AccountService);
exports.AccountService = AccountService;
//# sourceMappingURL=accountservice.js.map