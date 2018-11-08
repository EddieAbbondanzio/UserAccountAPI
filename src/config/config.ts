import { DatabaseConfig } from "./databaseconfig";
import { ConfigType } from "./configtype";
import { EmailCredentials } from "../logic/email/emailcredentials";
import { injectable } from "inversify";

/**
 * Configuration settings for the app. This contains the
 * database credentials, JWT key, and more.
 */
@injectable()
export class Config {
    /**
     * The configuration type this is.
     */
    public configType: ConfigType;

    /**
     * The secret key to use to sign JWTs
     */
    public tokenSignature: string;

    /**
     * The username and password for the email
     * service to use.
     */
    public emailCredentials: EmailCredentials;

    /**
     * The port to listen for incoming requests on.
     */
    public port: Number;

    /**
     * The configuration to use to work with the 
     * database.
     */
    public database: DatabaseConfig;

    /**
     * Create a new config setup.
     */
    constructor() {
        this.emailCredentials = new EmailCredentials();
        this.database         = new DatabaseConfig();
    }
}