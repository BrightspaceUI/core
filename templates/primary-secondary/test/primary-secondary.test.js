import '../primary-secondary.js';
import { expect, fixture, html } from '@open-wc/testing';
import { runConstructor } from '../../../tools/constructor-test-helper.js';

describe('d2l-template-primary-secondary', () => {

	let elem;
	beforeEach(async() => {
		elem = await fixture(html`<d2l-template-primary-secondary></d2l-template-primary-secondary>`);
	});

	it('should pass all aXe tests', async() => {
		await expect(elem).to.be.accessible();
	});

	it('should construct', () => {
		runConstructor('d2l-template-primary-secondary');
	});
});
