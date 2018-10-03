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
const NodeMailer = require("nodemailer");
const textemail_1 = require("./types/textemail");
const htmlemail_1 = require("./types/htmlemail");
/**
 * Service for sending out emails.
 */
class ZohoEmailService {
    /**
     * Create a new email service
     * @param emailCredentials Username and passwords.
     */
    constructor(emailCredentials) {
        this.transporter = NodeMailer.createTransport({
            host: 'smtp.zoho.com',
            port: 465,
            secure: true,
            auth: emailCredentials
        });
        this.credentials = emailCredentials;
    }
    /**
     * Send out an email.
     * @param email The email to send out.
     */
    sendEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            //Service can only send emails from the email it has on file.
            if (email.sender != this.credentials.user) {
                email.sender = this.credentials.user;
            }
            let emailOptions = email.getSendOptions();
            return new Promise((resolve, reject) => {
                this.transporter.sendMail(emailOptions, (error, info) => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(info);
                    }
                });
            });
        });
    }
    /**
     * Create a new email for sending out. This prepopulates the email's
     * sender address to match the services.
     * @param reciever The reciever's email address.
     * @param subject The subject line of the email.
     * @param body The body of the email.
     * @param isHtml If the body is in html.
     */
    createNewEmail(reciever, subject, body, isHtml) {
        if (isHtml) {
            return new htmlemail_1.HtmlEmail(this.credentials.user, reciever, subject, body);
        }
        else {
            return new textemail_1.TextEmail(this.credentials.user, reciever, subject, body);
        }
    }
}
exports.ZohoEmailService = ZohoEmailService;

//# sourceMappingURL=zohoemailservice.js.map
