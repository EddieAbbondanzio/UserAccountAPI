import { expect } from 'chai';
import 'mocha';
import { ConfigType } from '../../../config/configtype';
import { ConfigTypeUtils } from '../../../config/configtypeutils';

/**
 * Test module ConfigTypeUtils
 */
describe('ConfigTypeUtils', () => {
    describe('fromCommandArgument()', () => {
        let configType: ConfigType;

        it('is Production for "prod"', () => {
            configType = ConfigTypeUtils.fromCommandArgument('prod');
            expect(configType).to.equal(ConfigType.Production);
        });

        it('is Development for "dev"', () => {
            configType = ConfigTypeUtils.fromCommandArgument('dev');
            expect(configType).to.equal(ConfigType.Development);
        });

        it('is Test for "test"', () => {
            configType = ConfigTypeUtils.fromCommandArgument('test');
            expect(configType).to.equal(ConfigType.Test);
        });

        it('throws error for bad input', () => {
            expect(() => { ConfigTypeUtils.fromCommandArgument('LOLWUT');}).to.throw();
        });
    });
});