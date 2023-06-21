import '../calendar.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

describe('d2l-calendar', () => {

	it('passes all aXe tests', async() => {
		const calendar = await fixture(html`<d2l-calendar selected-value="2015-09-02"></d2l-calendar>`);
		await expect(calendar).to.be.accessible({ ignoredRules: ['presentation-role-conflict'] });
	});

});
