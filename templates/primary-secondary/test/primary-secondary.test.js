import '../primary-secondary.js';
import { expect, fixture, html, nextFrame } from '@open-wc/testing';
import { runConstructor } from '../../../tools/constructor-test-helper.js';

describe('d2l-template-primary-secondary', () => {

	[
		{ name: 'fixed', resizable: false },
		{ name: 'resizable', resizable: true },
	].forEach((testCase) => {
		it(`${testCase.name} should pass all aXe tests`, async() => {
			const elem = await fixture(html`<d2l-template-primary-secondary ?resizable="${testCase.resizable}"></d2l-template-primary-secondary>`);

			// Wait for size to be calculated so that aria-valuenow is defined.
			await nextFrame();
			await nextFrame();

			await expect(elem).to.be.accessible();
		});
	});

	it('should construct', () => {
		runConstructor('d2l-template-primary-secondary');
	});
});
