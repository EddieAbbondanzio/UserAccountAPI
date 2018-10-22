import { DatabaseConfig } from "./databaseconfig";
import { ConfigType } from "./configtype";
import { EmailCredentials } from "../logic/email/emailcredentials";

/**
 * Configuration settings for the app. This contains the
 * database credentials, JWT key, and more.
 */
export class Config {
    /**
     * The current config to use.
     */
    public static current: Config;

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
    public database: DatabaseConfig;

    /**
     * Create a new config setup.
     */
    constructor() {
        if(Config.current){
            throw new Error('A config already exists?');
        }

        Config.current = this;

        this.emailCredentials = new EmailCredentials();
        this.database         = new DatabaseConfig();
    }
}