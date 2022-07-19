import '../empty-state-simple-button.js';
import { expect, fixture, html } from '@open-wc/testing';

describe ('d2l-empty-state-simple-button', () => {

	it('normal', async() => {
		const el = await fixture(html`
			<d2l-empty-state-simple-button
				description="There are no assignments to display."
				action-text="Create New Assignment">
			</d2l-empty-state-simple-button>
		`);
		await expect(el).to.be.accessible();
	});

});
