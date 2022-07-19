import '../empty-state-simple-link.js';
import { expect, fixture, html } from '@open-wc/testing';

describe ('d2l-empty-state-simple-link', () => {

	it('normal', async() => {
		const el = await fixture(html`
			<d2l-empty-state-simple-link
				description="There are no assignments to display."
				action-text="Create New Assignment"
				action-href="https://www.d2l.com/">
			</d2l-empty-state-simple-link>
		`);
		await expect(el).to.be.accessible();
	});

});
