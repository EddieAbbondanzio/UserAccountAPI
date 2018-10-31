import * as Express from 'express';

/**
 * A handler for the HTTP server that processes 
 * incoming user requests and responds.
 */
export interface IHandler {
    /**
     * Initialize a server request handler for use.
     * @param expressApp The running express application.
     */
    initRoutes(expressApp: Express.Application): void;
}