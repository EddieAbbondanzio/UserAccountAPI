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
const datamodule_1 = require("../../../data/datamodule");
const textemail_1 = require("../../services/email/types/textemail");
const usercreatevalidator_1 = require("../../validation/user/validators/usercreatevalidator");
const validationerror_1 = require("../../validation/validationerror");
/**
 * Business logic for the registration portion of the
 * authentication component.
 */
class RegistrationHandler extends logichandler_1.LogicHandler {
    /**
     * Create a new registration logic.
     * @param connection The database connection.
     * @param serviceLocator The dependency locator.
     */
    constructor(connection, serviceLocator) {
        super(connection, serviceLocator);
        this.emailService = serviceLocator.emailService;
        this.tokenManager = serviceLocator.tokenManager;
        this.userCreateValidator = new usercreatevalidator_1.UserCreateValidator();
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
            let user = yield datamodule_1.User.fromRegistration(registration);
            let vToken;
            //Is the user even valid?
            let validatorResult = this.userCreateValidator.validate(user);
            if (!validatorResult.isValid) {
                throw new validationerror_1.ValidationError('Failed to register new user.', validatorResult);
            }
            yield this.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                let userRepo = manager.getCustomRepository(datamodule_1.UserRepository);
                yield userRepo.add(user);
                //Now generate a validation token.
                vToken = new datamodule_1.VerificationToken(user);
                let tokenRepo = manager.getCustomRepository(datamodule_1.VerificationTokenRepository);
                yield tokenRepo.add(vToken);
                //Issue a login for the user
                let loginRepo = manager.getCustomRepository(datamodule_1.UserLoginRepository);
                let login = new datamodule_1.UserLogin(user);
                login.token = yield this.tokenManager.issueToken(user);
                yield loginRepo.add(login);
                //Set their login, and get ready to return things.
                user.login = login;
            }));
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
            let vTokenRepo = this.connection.getCustomRepository(datamodule_1.VerificationTokenRepository);
            let vToken = yield vTokenRepo.findByUser(user);
            //Not found, or bad match
            if (!vToken || vToken.code !== verificationCode) {
                return false;
            }
            else {
                user.isVerified = true;
            }
            yield this.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                let userRepo = manager.getCustomRepository(datamodule_1.UserRepository);
                let tokenRepo = manager.getCustomRepository(datamodule_1.VerificationTokenRepository);
                yield Promise.all([userRepo.update(user), tokenRepo.delete(vToken)]);
            }));
            return true;
        });
    }
    /**
     * The user didn't recieve their validation code. Resend them an
     * email with it again.
     * @param user The user to re email.
     * @returns True if no error.
     */
    resendVerificationEmail(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!user) {
                throw new Error('No user passed in.');
            }
            //User has already been verified.
            if (user.isVerified) {
                return true;
            }
            let vTokenRepo = this.connection.getCustomRepository(datamodule_1.VerificationTokenRepository);
            let vToken = yield vTokenRepo.findByUser(user);
            //Not found.
            if (!vToken) {
                return false;
            }
            return this.sendVerificationEmail(user, vToken);
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
            return this.emailService.sendEmail(validationEmail);
        });
    }
}
exports.RegistrationHandler = RegistrationHandler;
//# sourceMappingURL=registrationhandler.js.map