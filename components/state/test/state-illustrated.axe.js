import '../state-action-button.js';
import '../state-action-link.js';
import '../state-illustrated.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

describe ('d2l-state-illustrated', () => {

	it('no action', async() => {
		const el = await fixture(html`
			<d2l-state-illustrated
				description="Get started by clicking below to create your first learning path."
				illustration-name="desert-road"
				title-text="No Learning Paths Yet">
			</d2l-state-illustrated>
		`);
		await expect(el).to.be.accessible();
	});

	it('subtle button', async() => {
		const el = await fixture(html`
			<d2l-state-illustrated
				description="Get started by clicking below to create your first learning path."
				illustration-name="desert-road"
				title-text="No Learning Paths Yet">
				<d2l-state-action-button
					text="Create Learning Paths">
				</d2l-state-action-button>
			</d2l-state-illustrated>
		`);
		await expect(el).to.be.accessible();
	});

	it('primary button', async() => {
		const el = await fixture(html`
			<d2l-state-illustrated
				description="Get started by clicking below to create your first learning path."
				illustration-name="desert-road"
				title-text="No Learning Paths Yet">
				<d2l-state-action-button
					text="Create Learning Paths"
					primary>
				</d2l-state-action-button>
			</d2l-state-illustrated>
		`);
		await expect(el).to.be.accessible();
	});

	it('link', async() => {
		const el = await fixture(html`
			<d2l-state-illustrated
				description="Get started by clicking below to create your first learning path."
				illustration-name="desert-road"
				title-text="No Learning Paths Yet">
				<d2l-state-action-link
					text="Create Learning Paths"
					href="#">
				</d2l-state-action-link>
			</d2l-state-illustrated>
		`);
		await expect(el).to.be.accessible();
	});
});
