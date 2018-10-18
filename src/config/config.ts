import { EmailCredentials } from "../logic/services/email/emailcredentials";
import { DatabaseConfig } from "./databaseconfig";
import { ConfigType } from "./configtype";

/**
 * Configuration settings for the app. This contains the
 * database credentials, JWT key, and more.
 */
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
     * The configuration to use to work with the 
     * database.
     */
    public databaseConfig: DatabaseConfig;

    constructor() {
        this.emailCredentials = new EmailCredentials();
        this.databaseConfig   = new DatabaseConfig();
    }
}