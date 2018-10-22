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
const config_1 = require("./config");
const configtype_1 = require("./configtype");
const FileSystem = require("fs");
/**
 * Module for handling the configuration to run when
 * depending on if we are in test, dev, or production.
 */
var ConfigHandler;
(function (ConfigHandler) {
    /**
     * Get the current config to use.
     * @param configType The type of config to get.
     * @returns The config to use.
     */
    function loadConfig(configType) {
        return __awaiter(this, void 0, void 0, function* () {
            let rawConfig = yield loadRawConfig(configType);
            //Need to recreate the object now
            let config = new config_1.Config();
            config.configType = configType;
            config.tokenSignature = rawConfig.tokenSignature;
            config.emailCredentials.user = rawConfig.email.username;
            config.emailCredentials.pass = rawConfig.email.password;
            config.database.host = rawConfig.database.host;
            config.database.port = rawConfig.database.port;
            config.database.username = rawConfig.database.username;
            config.database.password = rawConfig.database.password;
            config.database.database = rawConfig.database.database;
            config.database.autoSchemaSync = rawConfig.database.autoSchemaSync;
            config.database.entities = rawConfig.database.entities;
            config.database.subscribers = rawConfig.database.subscribers;
            config.database.migrations = rawConfig.database.migrations;
            return config;
        });
    }
    ConfigHandler.loadConfig = loadConfig;
    /**
     * Loads in the config file. This will return 1 or more
     * configs based on what ever is in the file.
     * @param configType The config file type to load.
     * @returns The config from the file.
     */
    function loadRawConfig(configType) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                FileSystem.readFile('./config.json', (err, data) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        //Parse the file to json
                        let jsonString = data.toString();
                        let raw = JSON.parse(jsonString);
                        //Does it have the config we want?
                        let rawConfig = raw[configtype_1.ConfigType[configType].toLowerCase()];
                        if (rawConfig) {
                            resolve(rawConfig);
                        }
                        else {
                            reject('Failed to find config of type: ' + configtype_1.ConfigType[configType]);
                        }
                    }
                });
            });
        });
    }
})(ConfigHandler = exports.ConfigHandler || (exports.ConfigHandler = {}));
//# sourceMappingURL=confighandler.js.map