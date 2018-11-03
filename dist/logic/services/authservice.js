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
const user_1 = require("../models/user");
const stringutils_1 = require("../../util/stringutils");
const authenticationerror_1 = require("../../common/error/types/authenticationerror");
const userlogin_1 = require("../models/userlogin");
const resettoken_1 = require("../models/resettoken");
const verificationtoken_1 = require("../models/verificationtoken");
const textemail_1 = require("../email/types/textemail");
const usercreatevalidator_1 = require("../validation/user/validators/usercreatevalidator");
const validationerror_1 = require("../validation/validationerror");
const servicetype_1 = require("../common/servicetype");
const databaseservice_1 = require("../common/databaseservice");
/**
 * The authentication service of the system. This handles registering,
 * logging in, or updating user's passwords.
 */
class AuthService extends databaseservice_1.DatabaseService {
    /**
     * Create a new authentication service.
     * @param database The current database.
     * @param tokenManager The JWT manager.
     * @param emailSender The email sender service.
     */
    constructor(database, tokenManager, emailSender) {
        super(database);
        /**
         * The type of service it is.
         */
        this.serviceType = servicetype_1.ServiceType.Auth;
        this.tokenManager = tokenManager;
        this.emailSender = emailSender;
        this.userCreateValidator = new usercreatevalidator_1.UserCreateValidator();
    }
    /**
     * Login a user via their credentials.
     * @param username The user's username.
     * @param password The user's password.
     * @returns The user if successful. Otherwise null.
     */
    loginUserViaCredentials(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            if (stringutils_1.StringUtils.isEmpty(username) || stringutils_1.StringUtils.isEmpty(password)) {
                throw new Error('No username or password passed in!');
            }
            let user = yield this.database.userRepo.findByUsername(username);
            if (!user) {
                return null;
            }
            //Are they authentic?
            if (!(yield user.validatePassword(password))) {
                throw new authenticationerror_1.AuthenticationError('User is not authorized.');
            }
            //Issue them a login
            let login = new userlogin_1.UserLogin(user);
            login.token = yield this.tokenManager.issueToken(user);
            //Save it
            yield this.database.loginRepo.add(login);
            user.login = login;
            return user;
        });
    }
    /**
     * Login a user using a JWT they have.
     * @param token The JWT from a previous login.
     * @returns The user if successful. Otherwise null.
     */
    loginUserViaToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            let payLoad = yield this.tokenManager.authenticateToken(token);
            let user = yield this.database.userRepo.findById(payLoad.userId);
            //Issue them a login
            let login = new userlogin_1.UserLogin(user);
            login.token = yield this.tokenManager.issueToken(user);
            //Save it
            yield this.database.loginRepo.add(login);
            user.login = login;
            return user;
        });
    }
    /**
     * Log out a user that is currently logged in.
     * @param user The username to log out.
     * @returns True if logged out.
     */
    logoutUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!user.login) {
                throw new Error('User is not logged in!');
            }
            //Delete it from the db
            yield this.database.loginRepo.delete(user.login);
            user.login = null;
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
            if (!user) {
                throw new Error('No user passed in');
            }
            //Need to pull in the reset token for them.
            let resetToken = yield this.database.resetTokenRepo.findByUser(user);
            if (resetToken && resetToken.code == resetCode) {
                yield user.setPassword(newPassword);
                yield this.database.startTransaction();
                yield Promise.all([this.database.resetTokenRepo.delete(resetToken),
                    this.database.userRepo.updatePassword(user)]);
                yield this.database.commitTransaction();
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
            if (!user) {
                throw new Error('No user passed in.');
            }
            if (!(yield user.validatePassword(currPassword))) {
                throw new authenticationerror_1.AuthenticationError('Invalid password.');
            }
            //Gotta update the password before we can update the user in the db.
            yield user.setPassword(newPassword);
            yield this.database.userRepo.updatePassword(user);
        });
    }
    /**
     * Register a new user with the system. This will
     * send them a confirmation email before they are done.
     * @param registration The user's info.
     * @returns The new user, or null if it failed.
     */
    registerNewUser(registration) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!registration) {
                throw new Error('No registration passed in.');
            }
            let user = yield user_1.User.fromRegistration(registration);
            let vToken;
            //Is the user even valid?
            let validatorResult = this.userCreateValidator.validate(user);
            if (!validatorResult.isValid) {
                throw new validationerror_1.ValidationError('Failed to register new user.', validatorResult);
            }
            yield this.database.startTransaction();
            yield this.database.userRepo.add(user);
            //Now generate a validation token.
            vToken = new verificationtoken_1.VerificationToken(user);
            yield this.database.verificationTokenRepo.add(vToken);
            //Create their login
            let login = new userlogin_1.UserLogin(user);
            login.token = yield this.tokenManager.issueToken(user);
            yield this.database.loginRepo.add(login);
            user.login = login;
            yield this.database.commitTransaction();
            //Send them the email
            yield this.sendVerificationEmail(user, vToken);
            return user;
        });
    }
    /**
     * Verify a user's email by checking the validation code they gave us.
     * @param user The user whos email we need to validate.
     * @param verificationCode The validation code they provided.
     * @returns True if the code was valid.
     */
    verifyUserEmail(user, verificationCode) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!user) {
                throw new Error('No user passed in.');
            }
            //Is user already validated?
            if (user.isVerified) {
                return true;
            }
            let vToken = yield this.database.verificationTokenRepo.findByUser(user);
            //Not found, or bad match
            if (!vToken || vToken.code !== verificationCode) {
                return false;
            }
            else {
                user.isVerified = true;
            }
            yield this.database.startTransaction();
            yield Promise.all([this.database.userRepo.update(user),
                this.database.verificationTokenRepo.delete(vToken)]);
            yield this.database.commitTransaction();
            return true;
        });
    }
    /**
     * The user didn't recieve their validation code. Resend them an
     * email with it again.
     * @param user The user to re email.
     */
    resendVerificationEmail(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!user) {
                throw new Error('No user passed in.');
            }
            //User has already been verified.
            if (user.isVerified) {
                return;
            }
            let vToken = yield this.database.verificationTokenRepo.findByUser(user);
            yield this.sendVerificationEmail(user, vToken);
        });
    }
    /**
     * Validate that a user is who they claim to be. This will check their username
     * against the login provided in the database.
     * @param user The user to validate.
     * @param loginCode Their login guid.
     */
    validateUser(user, loginCode) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!user) {
                throw new Error('No user passed in');
            }
            //Try to find the login.
            let userLogin = yield this.database.loginRepo.findByUser(user);
            if (userLogin && userLogin.code == loginCode) {
                return true;
            }
            else {
                return false;
            }
        });
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
            let user = yield this.database.userRepo.findByUsername(username);
            //Only send an email if a user was found.
            if (user) {
                //Generate them a reset token.
                let rToken = new resettoken_1.ResetToken(user);
                yield this.database.resetTokenRepo.add(rToken);
                let resetEmail = new textemail_1.TextEmail(user.email, 'No Mans Blocks Password Reset', 'Hi, your password reset code is: ' + rToken.code);
                yield this.emailSender.sendEmail(resetEmail);
            }
        });
    }
    /**
     * Send the user their validation code via an email.
     * @param user The user to re email.
     * @param vToken Their validation code.
     */
    sendVerificationEmail(user, vToken) {
        return __awaiter(this, void 0, void 0, function* () {
            let validationEmail = new textemail_1.TextEmail(user.email, "No Man's Blocks Account Confirmation.", "Thanks for joining! Your confirmation code is: " + vToken.code);
            return this.emailSender.sendEmail(validationEmail);
        });
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=authservice.js.map