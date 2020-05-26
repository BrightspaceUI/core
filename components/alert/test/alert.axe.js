import '../alert.js';
import { expect, fixture, html } from '@open-wc/testing';

describe('d2l-alert', () => {

	[
		'default',
		'warning',
		'critical',
		'success',
		'call-to-action',
		'error'
	].forEach((type) => {
		it(`passes aXe tests for type "${type}"`, async() => {
			const el = await fixture(html`<d2l-alert type="${type}">message</d2l-alert>`);
			await expect(el).to.be.accessible();
		});
	});

});
