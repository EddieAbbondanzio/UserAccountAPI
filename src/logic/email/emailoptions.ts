
/**
 * NodeMailer options for the email transporter.
 */
export class EmailOptions {
    /**
     * The reciever's email address.
     */
    public to: string;

    /**
     * The sender's email address.
     */
    public from: string;

    /**
     * The subject line of the email.
     */
    public subject: string;

    /**
     * The plain text body of the message.
     */
    public text: string;

    /**
     * The html body of the message.
     */
    public html: string;

    /**
     * Create a new set of email options.
     * @param to The reciever's email address.
     * @param from The sender's email address.
     * @param subject The subject line of the email.
     * @param body The body of the email.
     * @param isHtml Is the body html?
     */
    constructor(to: string, from: string, subject: string, body: string, isHtml?:boolean) {
        this.to = to;
        this.from = from;
        this.subject = subject;
        
        if(isHtml){
            this.html = body;
        }
        else {
            this.text = body;
        }
    }
}