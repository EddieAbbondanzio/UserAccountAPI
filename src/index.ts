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
import { ServiceType } from './logic/common/servicetype';
import { User } from './logic/models/user';
import { ResetToken } from './logic/models/resettoken';
import { IAuthService } from './logic/contract/services/iauthservice';
import { Server } from './server/server';
import { IUserHandler } from './server/contract/iuserhandler';
import { UserHandler } from './server/handlers/user/userhandler';
import { IAuthHandler } from './server/contract/iauthhandler';
import { AuthHandler } from './server/handlers/auth/authhandler';
import { IAccessTokenService } from './logic/contract/services/iaccesstokenservice';
import { AccessTokenService } from './logic/services/tokenservice';

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
    let tokenService: IAccessTokenService = new AccessTokenService(config.tokenSignature);

    ServiceLocator.register(tokenService);
    ServiceLocator.register(new AuthService(database, tokenService, emailSender));
    ServiceLocator.register(new UserService(database));

    let userHandler: IUserHandler = new UserHandler(ServiceLocator.get(ServiceType.User));
    let authHandler: IAuthHandler = new AuthHandler(ServiceLocator.get(ServiceType.Auth));

    let server: Server = new Server(userHandler, authHandler);

    console.log('Ready...');
  }
  catch (error) {
    console.error('Failed to init app.');
    console.error(error);
  }
}

initialize();