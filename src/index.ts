import { Config } from './config/config';
import { ConfigHandler } from './config/confighandler';
import { ConfigType } from './config/configtype';
import { ConfigTypeUtils } from './config/configtypeutils';
import * as Minimist from 'minimist';
import { createConnection } from 'typeorm';
import { IDatabase } from './logic/common/idatabase';
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
    //Get the command line arguments
    var parseArgs = Minimist(process.argv);

    //Load in the config to run with
    let configType: ConfigType = ConfigTypeUtils.fromCommandArgument(parseArgs.e);
    let config: Config = await ConfigHandler.loadConfig(configType);

    //Get the database up
    let database: IDatabase = new MySqlDatabase();
    await database.initialize(config.database);


    //Set up the BLL.
    let emailSender: IEmailSender = new ZohoEmailService(config.emailCredentials);
    let tokenManager: TokenManager = new TokenManager(config.tokenSignature);

    ServiceLocator.register(new AuthService(database, tokenManager, emailSender));
    ServiceLocator.register(new UserService(database));




    // //Set up the data layer
    // AppDomain.dataAccessLayer = new MysqlDataAccessLayer();
    // await AppDomain.dataAccessLayer.initialize();


    //Get the data connection ready to roll.
    // const connection = await DataContext.initializeDatabaseAsync();

    // // Set up the logic layer for use.
    // const serviceLocator = new ServiceLocator();

    // //Spin up the server. This takes and handles the 
    // //HTTP Requests clients make.
    // const server = new Server(serviceLocator);

    // let userReg = new UserRegistration('testuser', 'password', 'Test User', 'me@eddieabbondanz.io');

    // let regHandler = new RegistrationHandler(connection, serviceLocator);
    // await regHandler.registerNewUser(userReg);

    //What method to run as?


    // let dataAccessLayer: DataAccessLayer = new DataAccessLayer();

    // let loginRepo: IUserLoginRepository = dataAccessLayer.get<IUserLoginRepository>('IUserLoginRepository');

    // console.log(loginRepo);



    // console.log('Config: ', config); 
    console.log('Server ready...');
  }
  catch (error) {
    console.error('Failed to init app.');
    console.error(error);
  }
}

initialize();