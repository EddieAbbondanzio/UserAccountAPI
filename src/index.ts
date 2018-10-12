import { Server } from './server/server';
import { DataContext } from './data/datacontext';
import { ServiceLocator } from './logic/servicelocator';
import { UserRegistration, UserRepository, User, UserStats } from './data/datamodule';
import { RegistrationHandler } from './logic/authentication/handlers/registrationhandler';

/**
 * Initialize the application for use. This first starts
 * up the data layer, then turns on the logic layer,
 * and lastly bring the server online.
 */
async function initialize() {
  try {
    //Get the data connection ready to roll.
    const connection = await DataContext.initializeDatabaseAsync();

    // Set up the logic layer for use.
    const serviceLocator = new ServiceLocator(connection);

    //Spin up the server. This takes and handles the 
    //HTTP Requests clients make.
    const server = new Server(serviceLocator);


    let userReg: UserRegistration = new UserRegistration();
    userReg.email = 'eddieabb95@gmail.com';
    userReg.name = 'Eddie Abbondanzio';
    userReg.password = 'testpassword';
    userReg.username = 'EddieAbb95';

    let regHandler: RegistrationHandler = new RegistrationHandler(connection, serviceLocator);
    let user = await regHandler.registerNewUser(userReg);

    console.log(user)
    


    console.log('Server ready...');
  }
  catch(error){
    console.error('Failed to init app.');
    console.error(error);
  }
}

initialize();