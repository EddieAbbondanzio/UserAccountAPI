import 'reflect-metadata';
import { createConnection, Connection } from 'typeorm';

/**
 * Handles managing the database and the 'connection'
 * to it.
 */
export module DataContext {
    /**
     * Initialize the database for use.
     */
    export async function initializeDatabaseAsync():Promise<Connection> {
        return createConnection();
    }
}