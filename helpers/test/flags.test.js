import { fake, replace, restore, stub } from 'sinon';
import { getFlag, getWarnMessage, mockFlag, resetFlag } from '../flags.js';
import { expect } from '@brightspace-ui/testing';

function setupFlagValue(name) {
	window.D2L = { LP: { Web: { UI: { Flags: { Flag: key => (key === name) } } } } };
}

describe('flags', () => {

	const oldD2L = window.D2L;
	beforeEach(() => {
		window.D2L = undefined;
	});

	afterEach(() => {
		window.D2L = oldD2L;
		restore();
	});

	it('should return default value when D2L API is not defined', async() => {
		expect(getFlag('some-flag', true)).to.be.true;
	});

	it('should return the flag value when D2L API is defined', async() => {
		setupFlagValue('some-flag');
		expect(getFlag('some-flag', false)).to.be.true;
	});

	it('should mock the flag', () => {
		setupFlagValue('mocked-flag');
		expect(getFlag('mocked-flag', true)).to.be.true;
		mockFlag('mocked-flag', false);
		expect(getFlag('mocked-flag', true)).to.be.false;
	});

	it('should reset the mock', () => {
		setupFlagValue('mocked-flag');
		mockFlag('mocked-flag', false);
		resetFlag('mocked-flag');
		expect(getFlag('mocked-flag', true)).to.be.true;
	});

	it('should warn when mocking a flag after it has been retrieved in a non-test environment', () => {
		stub(window, 'isD2LTestPage').value(false);
		const fakeWarn = replace(console, 'warn', fake());
		setupFlagValue('mocked-flag');

		getFlag('mocked-flag', true);
		mockFlag('mocked-flag', false);

		expect(fakeWarn).to.have.been.calledOnce;
		expect(fakeWarn).to.have.been.calledWith(getWarnMessage('mocked-flag'));
	});

	it('should not warn when mocking a flag after it has been retrieved in a test environment', () => {
		const fakeWarn = replace(console, 'warn', fake());
		setupFlagValue('mocked-flag');

		getFlag('mocked-flag', true);
		mockFlag('mocked-flag', false);

		expect(fakeWarn).to.not.have.been.called;
	});

});
