import { Server } from './server/server';
import { DataContext } from './data/datacontext';
import { ServiceLocator } from './logic/servicelocator';
import { UserRegistration, UserRepository, User, UserStats } from './data/datamodule';
import { RegistrationHandler } from './logic/authentication/handlers/registrationhandler';
import { UserComponent } from './logic/user/usercomponent';
import { AuthenticationComponent } from './logic/authentication/authenticationcomponent';
import * as DotEnv from 'dotenv';

/**
 * Initialize the application for use. This first starts
 * up the data layer, then turns on the logic layer,
 * and lastly bring the server online.
 */
async function initialize() {
  try {
    //Pull in env vars
    DotEnv.config();

    //Get the data connection ready to roll.
    const connection = await DataContext.initializeDatabaseAsync();

    // Set up the logic layer for use.
    const serviceLocator = new ServiceLocator();

    //Spin up the server. This takes and handles the 
    //HTTP Requests clients make.
    const server = new Server(serviceLocator);

    console.log('Server ready...');
  }
  catch(error){
    console.error('Failed to init app.');
    console.error(error);
  }
}

initialize();