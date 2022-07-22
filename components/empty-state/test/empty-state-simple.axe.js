import '../empty-state-simple.js';
import { expect, fixture, html } from '@open-wc/testing';

describe ('d2l-empty-state-simple', () => {

	it('passes all aXe tests', async() => {
		const el = await fixture(html`
			<d2l-empty-state-simple
				description="There are no assignments to display.">
			</d2l-empty-state-simple>
		`);
		await expect(el).to.be.accessible();
	});

});
