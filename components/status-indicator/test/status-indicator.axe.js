import '../status-indicator.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

describe('d2l-status-indicator', () => {

	[
		'default',
		'none',
		'alert',
		'success'
	].forEach((testCase) => {
		[true, false].forEach((bold) => {
			/**
			 * @type {'default'|'none'|'alert'|'success'}
			 */
			const state = testCase;

			it(`passes aXe tests for state="${state}" and bold="${bold}"`, async() => {
				const elem = await fixture(html`<d2l-status-indicator text="test subtle" state="${state}" ?bold="${bold}"></d2l-status-indicator>`);
				await expect(elem).to.be.accessible();
			});
		});
	});

});
