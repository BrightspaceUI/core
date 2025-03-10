import { expect } from '@brightspace-ui/testing';
import { getFlag } from '../flags.js';

describe('flags', () => {

	it('should return default value when D2L API is not defined', async() => {
		expect(getFlag('some-flag', true)).to.be.true;
	});

	it('should return the flag value when D2L API is defined', async() => {
		window.D2L = { LP: { Web: { UI: { Flags: { Flag: key => (key === 'some-flag') } } } } };
		expect(getFlag('some-flag', false)).to.be.true;
	});

});
