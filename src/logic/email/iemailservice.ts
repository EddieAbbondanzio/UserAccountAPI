import { IEmail } from "./types/iemail";

/**
 * Interface that an email service needs to implement.
 */
export interface IEmailService {
    /**
     * Send an email out.
     * @param email The email to send.
     */
    sendEmail(email: IEmail):Promise<void>;

    /**
     * Create a new email for sending out. This prepopulates
     * the sender's address to match up with the services.
     * @param reciever The reciever's email address.
     * @param subject The subject line.
     * @param body The body of the email.
     * @param isHtml If the body is html encoded.
     */
    createNewEmail(reciever?: string, subject?: string, body?: string, isHtml?: boolean):IEmail;
}