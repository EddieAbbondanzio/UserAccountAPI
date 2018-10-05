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
/**
 * Handler for recovering forgotten accounts.
 */
class RecoveryHandler extends logichandler_1.LogicHandler {
    /**
     * Create a new recovery handler.
     * @param connection The database connection.
     * @param serviceLocator The service locator.
     */
    constructor(connection, serviceLocator) {
        super(connection, serviceLocator);
        this.emailService = serviceLocator.emailService;
    }
    /**
     * User forgot their username and wants it emailed to them.
     * @param email The user's email to send it to.
     */
    emailUserTheirUsername(email) {
        return __awaiter(this, void 0, void 0, function* () {
            let userRepo = this.connection.getCustomRepository(datamodule_1.UserRepository);
            let user = yield userRepo.findByEmail(email);
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
            let userRepo = this.connection.getCustomRepository(datamodule_1.UserRepository);
            let user = yield userRepo.findByEmail(username);
            //Only send an email if a user was found.
            if (user) {
                //Generate them a reset token.
                let tokenRepo = this.connection.getCustomRepository(datamodule_1.ResetTokenRespository);
                let rToken = datamodule_1.ResetToken.generateToken(user);
                yield tokenRepo.add(rToken);
                let resetEmail = new textemail_1.TextEmail(user.email, 'No Mans Blocks Password Reset', 'Hi, your password reset code is: ' + rToken.code);
                yield this.emailService.sendEmail(resetEmail);
            }
        });
    }
}
exports.RecoveryHandler = RecoveryHandler;

//# sourceMappingURL=recoveryhandler.js.map
