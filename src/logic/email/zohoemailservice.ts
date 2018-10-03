import { IEmailService } from "./iemailservice";
import NodeMailer = require('nodemailer');
import { EmailCredentials } from "./emailcredentials";
import { resolve } from "dns";
import { IEmail } from "./types/iemail";
import { EmailOptions } from "./emailoptions";
import { TextEmail } from "./types/textemail";
import { HtmlEmail } from "./types/htmlemail";

/**
 * Service for sending out emails.
 */
export class ZohoEmailService implements IEmailService {
    /**
     * The email transporter for delivering emails.
     */
    private transporter: NodeMailer.Transporter;

    /**
     * The credentials of the service.
     */
    private credentials: EmailCredentials;

    /**
     * Create a new email service
     * @param emailCredentials Username and passwords.
     */
    constructor(emailCredentials: EmailCredentials){
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
    public async sendEmail(email: IEmail): Promise<void> {
        //Service can only send emails from the email it has on file.
        if(email.sender != this.credentials.user){
            email.sender = this.credentials.user;
        }
        
        let emailOptions: EmailOptions = email.getSendOptions();

        return new Promise<void>((resolve, reject) => {
            this.transporter.sendMail(emailOptions, (error, info) => {
                if(error){
                    reject(error);
                }
                else {
                    resolve(info);
                }
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
    public createNewEmail(reciever?: string, subject?: string, body?: string, isHtml?: boolean):IEmail {
        if(isHtml){
            return new HtmlEmail(this.credentials.user, reciever, subject, body);
        }
        else {
            return new TextEmail(this.credentials.user, reciever, subject, body);
        }
    }
}