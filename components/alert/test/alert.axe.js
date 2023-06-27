import '../alert.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

describe('d2l-alert', () => {

	[
		'default',
		'warning',
		'critical',
		'success',
		'call-to-action',
		'error'
	].forEach((testCase) => {
		it(`passes aXe tests for type "${testCase}"`, async() => {
			/**
			 * @type {'default'|'critical'|'success'|'warning'}
			 */
			const type = testCase;
			const el = await fixture(html`<d2l-alert type="${type}">message</d2l-alert>`);
			await expect(el).to.be.accessible();
		});
	});

});
