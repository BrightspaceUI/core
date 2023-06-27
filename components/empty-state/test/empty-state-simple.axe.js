import '../empty-state-action-button.js';
import '../empty-state-action-link.js';
import '../empty-state-simple.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

describe ('d2l-empty-state-simple', () => {

	it('no action', async() => {
		const el = await fixture(html`
			<d2l-empty-state-simple
				description="There are no assignments to display.">
			</d2l-empty-state-simple>
		`);
		await expect(el).to.be.accessible();
	});

	it('button action', async() => {
		const el = await fixture(html`
			<d2l-empty-state-simple
				description="There are no assignments to display.">
				<d2l-empty-state-action-button
					text="Create New Assignment">
				</d2l-empty-state-action-button>
			</d2l-empty-state-simple>
		`);
		await expect(el).to.be.accessible();
	});

	it('link action', async() => {
		const el = await fixture(html`
			<d2l-empty-state-simple
				description="There are no assignments to display.">
				<d2l-empty-state-action-link
					text="Create New Assignment"
					href="https://d2l.com">
				</d2l-empty-state-action-link>
			</d2l-empty-state-simple>
		`);
		await expect(el).to.be.accessible();
	});

});
