import { expect } from 'chai';
import 'mocha';
import { Config } from '../../../config/config';

/**
 * Test module for Config.
 */
describe('config', () => {
    describe('constructor()', () => {
        let config: Config = new Config();

        it('assigns Config.current', () => {
            expect(Config.current).to.equal(config);
        });

        it('throws an error if a config alread exists', () => {
            expect(() => { new Config(); }).to.throw();
        });
    });
});