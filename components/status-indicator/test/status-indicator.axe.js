import '../status-indicator.js';
import { expect, fixture, html } from '@open-wc/testing';

describe('d2l-status-indicator', () => {

	[
		'default',
		'none',
		'alert',
		'success'
	].forEach((state) => {
		[true, false].forEach((bold) => {
			it(`passes aXe tests for state="${state}" and bold="${bold}"`, async() => {
				const elem = await fixture(html`<d2l-status-indicator text="test subtle" state="${state}" ?bold="${bold}"></d2l-status-indicator>`);
				await expect(elem).to.be.accessible();
			});
		});
	});

});
