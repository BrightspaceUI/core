import '../state-action-button.js';
import '../state-action-link.js';
import '../state-empty-simple.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

describe ('d2l-state-empty-simple', () => {

	it('no action', async() => {
		const el = await fixture(html`
			<d2l-state-empty-simple
				description="There are no assignments to display.">
			</d2l-state-empty-simple>
		`);
		await expect(el).to.be.accessible();
	});

	it('button action', async() => {
		const el = await fixture(html`
			<d2l-state-empty-simple
				description="There are no assignments to display.">
				<d2l-state-action-button
					text="Create New Assignment">
				</d2l-state-action-button>
			</d2l-state-empty-simple>
		`);
		await expect(el).to.be.accessible();
	});

	it('link action', async() => {
		const el = await fixture(html`
			<d2l-state-empty-simple
				description="There are no assignments to display.">
				<d2l-state-action-link
					text="Create New Assignment"
					href="https://d2l.com">
				</d2l-state-action-link>
			</d2l-state-empty-simple>
		`);
		await expect(el).to.be.accessible();
	});

});
