import { Server } from './server/server';
import { DataContext } from './data/datacontext';
import { ServiceLocator } from './logic/servicelocator';
import { UserRegistration } from './data/datamodule';

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
    
    let userRegistration = new UserRegistration();
    userRegistration.username = "bert";
    userRegistration.password = "password";
    userRegistration.email = "test@me.co";
    userRegistration.name = "Bert Person";
    await serviceLocator.userService.register(userRegistration)


    //Spin up the server. This takes and handles the 
    //HTTP Requests clients make.
    const server = new Server(serviceLocator);

    //First we add a user
   // var user = await serviceCoordinator.userService.registerNewUser('NewUser2', 'hunter2000', 'John Smith');

    console.log('Server ready...');
  }
  catch(error){
    console.error('Failed to init app.');
    console.error(error);
  }
}

initialize();