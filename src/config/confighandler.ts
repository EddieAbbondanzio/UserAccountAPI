import { Config } from "./config";
import { ConfigType } from "./configtype";
import * as FileSystem from 'fs';

/**
 * Module for handling the configuration to run when
 * depending on if we are in test, dev, or production.
 */
export module ConfigHandler {
    /**
     * Get the current config to use. 
     * @param configType The type of config to get.
     * @returns The config to use.
     */
    export async function loadConfig(configType: ConfigType): Promise<Config> {
        let rawConfig: any = await loadRawConfig(configType);
        
        //Need to recreate the object now
        let config: Config = new Config();
        config.configType  = configType;
        config.tokenSignature = rawConfig.tokenSignature;
        
        config.emailCredentials.user = rawConfig.email.username;
        config.emailCredentials.pass = rawConfig.email.password;

        config.port = rawConfig.port;

        config.database.host           = rawConfig.database.host;
        config.database.port           = rawConfig.database.port;
        config.database.username       = rawConfig.database.username;
        config.database.password       = rawConfig.database.password;
        config.database.database       = rawConfig.database.database;
        config.database.autoSchemaSync = rawConfig.database.autoSchemaSync;
        config.database.entities       = rawConfig.database.entities;
        config.database.subscribers    = rawConfig.database.subscribers;
        config.database.migrations     = rawConfig.database.migrations;

        return config;
    }

    /**
     * Loads in the config file. This will return 1 or more
     * configs based on what ever is in the file.
     * @param configType The config file type to load.
     * @returns The config from the file.
     */
    async function loadRawConfig(configType: ConfigType): Promise<Config> {
        return new Promise<Config>((resolve, reject) => {
            FileSystem.readFile('./config.json', (err, data) => {
                if(err){
                    reject(err);
                }
                else {
                    //Parse the file to json
                    let jsonString: string = data.toString();
                    let raw: any = JSON.parse(jsonString);

                    //Does it have the config we want?
                    let rawConfig: any = raw[ConfigType[configType].toLowerCase()]

                    if(rawConfig){
                        resolve(rawConfig);
                    }
                    else {
                        reject('Failed to find config of type: ' + ConfigType[configType]);
                    }
                }
            });
        });
    }
}