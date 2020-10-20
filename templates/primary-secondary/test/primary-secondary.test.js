import '../primary-secondary.js';
import { expect, fixture, html } from '@open-wc/testing';
import { runConstructor } from '../../../tools/constructor-test-helper.js';

describe('d2l-template-primary-secondary', () => {

	[
		{ name: 'fixed', resizable: false },
		{ name: 'resizable', resizable: true },
	].forEach((testCase) => {
		it(`${testCase.name} should pass all aXe tests`, async() => {
			const elem = await fixture(html`<d2l-template-primary-secondary ?resizable="${testCase.resizable}"></d2l-template-primary-secondary>`);
			await expect(elem).to.be.accessible();
		});
	});

	it('should construct', () => {
		runConstructor('d2l-template-primary-secondary');
	});
});
