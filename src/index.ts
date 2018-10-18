import { Server } from './server/server';
import { DataContext } from './data/datacontext';
import { ServiceLocator } from './logic/servicelocator';
import { Config } from './config/config';
import { ConfigHandler } from './config/confighandler';
import { ConfigType } from './config/configtype';
import { ConfigTypeUtils } from './config/configtypeutils';
import * as Minimist from 'minimist';

/**
 * Initialize the application for use. This first starts
 * up the data layer, then turns on the logic layer,
 * and lastly bring the server online.
 */

async function initialize() {
  try {
    //Get the command line arguments
    var parseArgs = Minimist(process.argv);

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


    let configType: ConfigType = ConfigTypeUtils.fromCommandArgument(parseArgs.e);
    let config: Config = await ConfigHandler.getConfig(ConfigType.Development);

    console.log('Config: ', config); 
    console.log('Server ready...');
  }
  catch (error) {
    console.error('Failed to init app.');
    console.error(error);
  }
}

initialize();