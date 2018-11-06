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
const authenticationerror_1 = require("../../common/error/types/authenticationerror");
const userlogin_1 = require("../models/userlogin");
const resettoken_1 = require("../models/resettoken");
const verificationtoken_1 = require("../models/verificationtoken");
const textemail_1 = require("../email/types/textemail");
const userregistrationvalidator_1 = require("../validation/user/validators/userregistrationvalidator");
const validationerror_1 = require("../validation/validationerror");
const servicetype_1 = require("../common/servicetype");
const databaseservice_1 = require("../common/databaseservice");
const nullargumenterror_1 = require("../../common/error/types/nullargumenterror");
/**
 * The authentication service of the system. This handles registering,
 * logging in, or updating user's passwords.
 */
class AuthService extends databaseservice_1.DatabaseService {
    /**
     * Create a new authentication service.
     * @param database The current database.
     * @param tokenService The JWT manager.
     * @param emailSender The email sender service.
     */
    constructor(database, tokenService, emailSender) {
        super(database);
        /**
         * The type of service it is.
         */
        this.serviceType = servicetype_1.ServiceType.Auth;
        this.tokenService = tokenService;
        this.emailSender = emailSender;
        this.userRegistrationValidator = new userregistrationvalidator_1.UserRegistrationValidator();
    }
    /**
     * Login a user via their credentials.
     * @param username The user's username.
     * @param password The user's password.
     * @returns An access token if successful.
     */
    loginUserViaCredentials(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            //Check for good inputs.
            if (username == null) {
                throw new nullargumenterror_1.NullArgumentError('username');
            }
            else if (password == null) {
                throw new nullargumenterror_1.NullArgumentError('password');
            }
            //Pull in the user from the database.
            let user = yield this.database.userRepo.findByUsername(username);
            //If no user found, or bad password crash and burn.
            if (user == null || !(yield user.validatePassword(password))) {
                throw new authenticationerror_1.AuthenticationError('Failed login attempt');
            }
            return this.loginUser(user);
        });
    }
    /**
     * Relogin a user using the access token they provided. This
     * will invalidate their current token and give them a new one.
     * @param bearerToken The current bearer token.
     * @returns A refreshed access token if successful.
     */
    loginUserViaToken(bearerToken) {
        return __awaiter(this, void 0, void 0, function* () {
            if (bearerToken == null) {
                throw new nullargumenterror_1.NullArgumentError('bearerToken');
            }
            //Authenticate the token, then pull in the user.
            let accessToken = yield this.tokenService.authenticateToken(bearerToken);
            let user = yield this.database.userRepo.findById(accessToken.userId);
            return this.loginUser(user);
        });
    }
    /**
     * Log in a user.
     * @param user The user to log in.
     * @returns Their access token.
     */
    loginUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (user == null) {
                throw new nullargumenterror_1.NullArgumentError('user');
            }
            try {
                yield this.database.startTransaction();
                //Delete out any old ones
                yield this.database.loginRepo.deleteForUser(user);
                //Issue them a login, and save it.
                let login = new userlogin_1.UserLogin(user);
                yield this.database.loginRepo.add(login);
                yield this.database.commitTransaction();
                //Return a JWT for them
                return this.tokenService.issueToken(login);
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
     * Log out a user by invalidating their JWT.
     * @param user The user to log out.
     */
    logoutUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (user == null) {
                throw new nullargumenterror_1.NullArgumentError('user');
            }
            yield this.database.loginRepo.deleteForUser(user);
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
     * Register a new user with the system. This will
     * send them a confirmation email before they are done.
     * @param registration The user's info.
     * @returns The new user, or null if it failed.
     */
    registerNewUser(registration) {
        return __awaiter(this, void 0, void 0, function* () {
            if (registration == null) {
                throw new nullargumenterror_1.NullArgumentError('registration');
            }
            //Is the user even valid?
            let validatorResult = this.userRegistrationValidator.validate(registration);
            if (!validatorResult.isValid) {
                throw new validationerror_1.ValidationError('Failed to register new user.', validatorResult);
            }
            //Generate the user
            let user = yield user_1.User.fromRegistration(registration);
            let vToken;
            try {
                yield this.database.startTransaction();
                yield this.database.userRepo.add(user);
                //Now generate a validation token.
                vToken = new verificationtoken_1.VerificationToken(user);
                yield this.database.verificationTokenRepo.add(vToken);
                yield this.database.commitTransaction();
                //Send them the email
                yield this.sendVerificationEmail(user, vToken);
                return user;
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
            if (user.isVerified) {
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
     * Validate that a user is who they claim to be. This will check their username
     * against the login provided in the database.
     * @param user The user to validate.
     * @param loginCode Their login guid.
     */
    validateLogin(user, loginCode) {
        return __awaiter(this, void 0, void 0, function* () {
            if (user == null) {
                throw new nullargumenterror_1.NullArgumentError('user');
            }
            //Try to find the login.
            let userLogin = yield this.database.loginRepo.findByUser(user);
            //Did we find one, and is the code accurate?
            return userLogin != null && userLogin.code == loginCode;
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
            else if (vToken == null) {
                throw new nullargumenterror_1.NullArgumentError('vToken');
            }
            let validationEmail = new textemail_1.TextEmail(user.email, "Account Confirmation", "Thanks for joining! Your confirmation code is: " + vToken.code);
            return this.emailSender.sendEmail(validationEmail);
        });
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=authservice.js.map