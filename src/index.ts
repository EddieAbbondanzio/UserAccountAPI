import { Config } from './config/config';
import { ConfigHandler } from './config/confighandler';
import { ConfigType } from './config/configtype';
import { ConfigTypeUtils } from './config/configtypeutils';
import * as Minimist from 'minimist';
import { createConnection } from 'typeorm';
import { Database } from './logic/common/database';
import { MySqlDatabase } from './data/mysqldatabase';
import { UserService } from './logic/services/userservice';
import { ServiceLocator } from './logic/common/servicelocator';
import { AuthService } from './logic/services/authservice';
import { IEmailSender } from './logic/email/iemailsender';
import { ZohoEmailService } from './logic/email/zohoemailsender';
import { TokenManager } from './logic/helpers/tokenmanager';
import { ServiceType } from './logic/common/servicetype';
import { User } from './logic/models/user';
import { ResetToken } from './logic/models/resettoken';

/**
 * Initialize the application for use. This first starts
 * up the data layer, then turns on the logic layer,
 * and lastly bring the server online.
 */
async function initialize() {
  try {
    console.log('Starting Server');

    //Get the command line arguments
    var parseArgs = Minimist(process.argv);

    //Load in the config to run with
    let configType: ConfigType = ConfigTypeUtils.fromCommandArgument(parseArgs.e);
    let config: Config = await ConfigHandler.loadConfig(configType);
    console.log('Mode: ', ConfigType[configType]);

    //Get the database up
    let database: Database = new MySqlDatabase();
    await database.initialize(config.database);

    //Set up the BLL.
    let emailSender: IEmailSender = new ZohoEmailService(config.emailCredentials);
    let tokenManager: TokenManager = new TokenManager(config.tokenSignature);

    ServiceLocator.register(new AuthService(database, tokenManager, emailSender));
    ServiceLocator.register(new UserService(database));

    console.log('Ready...');
  }
  catch (error) {
    console.error('Failed to init app.');
    console.error(error);
  }
}

initialize();