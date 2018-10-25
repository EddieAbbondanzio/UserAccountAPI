import { ConfigType } from "./configtype";
import { ArgumentError } from "../common/errors/argumenterror";

/**
 * Helper utility methods related to the ConfigType enum.
 */
export module ConfigTypeUtils {
    /**
     * Convert a command line argument into the type of
     * config type to use.
     * @param arg The passed in command line argument.
     * @returns The matching config type.
     */
    export function fromCommandArgument(arg: string): ConfigType {
        switch (arg) {
            case 'prod':
                return ConfigType.Production;
            case 'dev':
                return ConfigType.Development;
            case 'test':
                return ConfigType.Test;
            default:
                throw new ArgumentError('Invalid config type of: ' + arg);
        }
    }
}