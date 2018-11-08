import { Config } from './config/config';
import { ConfigHandler } from './config/confighandler';
import { ConfigType } from './config/configtype';
import { ConfigTypeUtils } from './config/configtypeutils';
import * as Minimist from 'minimist';
import { Database } from './logic/common/database';
import { Server } from './server/server';
import { IocContainer } from './server/ioccontainer';
import { IOC_TYPES } from './common/ioc/ioctypes';

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

    //Load in the config to use.
    let configType: ConfigType = ConfigTypeUtils.fromCommandArgument(parseArgs.e);

    let config: Config = await ConfigHandler.loadConfig(configType);
    console.log('Mode: ', ConfigType[configType]);

    //Get the IOC container running.
    let container: IocContainer = new IocContainer(config);

    //Get the database up
    let database: Database = container.get<Database>(IOC_TYPES.Database);
    await database.initialize(config.database);

    //Fire up the server.
    let server: Server = container.get<Server>(IOC_TYPES.Server);

    console.log('Ready...');
  }
  catch (error) {
    console.error('Failed to init app.');
    console.error(error);
  }
}

initialize();