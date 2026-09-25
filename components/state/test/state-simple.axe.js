import '../state-action-button.js';
import '../state-action-link.js';
import '../state-simple.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

describe ('d2l-state-simple', () => {

	it('no action', async() => {
		const el = await fixture(html`
			<d2l-state-simple
				description="There are no assignments to display.">
			</d2l-state-simple>
		`);
		await expect(el).to.be.accessible();
	});

	it('button action', async() => {
		const el = await fixture(html`
			<d2l-state-simple
				description="There are no assignments to display.">
				<d2l-state-action-button
					text="Create New Assignment">
				</d2l-state-action-button>
			</d2l-state-simple>
		`);
		await expect(el).to.be.accessible();
	});

	it('link action', async() => {
		const el = await fixture(html`
			<d2l-state-simple
				description="There are no assignments to display.">
				<d2l-state-action-link
					text="Create New Assignment"
					href="https://d2l.com">
				</d2l-state-action-link>
			</d2l-state-simple>
		`);
		await expect(el).to.be.accessible();
	});

});
