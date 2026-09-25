import '../state-action-button.js';
import '../state-action-link.js';
import '../state-illustrated.js';
import { expect, fixture, html } from '@brightspace-ui/testing';
import { nothing } from 'lit';

function createState(opts) {
	const defaults = {
		content: nothing,
		description: 'Get started by clicking below to create your first learning path.'
	};
	const { content, description } = { ...defaults, ...opts };
	return html`
		<d2l-state-illustrated illustration-name="desert-road" title-text="No Learning Paths Yet" description="${description}">
			${content}
		</d2l-state-illustrated>
	`;
}

describe('state-illustrated', () => {

	[
		{ size: 'normal', width: 800 },
		{ size: 'small', width: 426 }
	].forEach(({ size, width }) => {
		[
			{ name: 'no-action', opts: { description: 'Create a learning path to get started.' } },
			{ name: 'button', opts: { content: html`<d2l-state-action-button text="Create Learning Paths"></d2l-state-action-button>` } },
			{ name: 'button-primary', opts: { content: html`<d2l-state-action-button primary text="Create Learning Paths"></d2l-state-action-button>` } },
			{ name: 'link', opts: { content: html`<d2l-state-action-link text="Create Learning Paths" href="#"></d2l-state-action-link>` } },
			{ name: 'link-with-target', opts: { content: html`<d2l-state-action-link text="Create Learning Paths" href="#" target="_blank"></d2l-state-action-link>` } },
		].forEach(({ name, opts }) => {
			it(`${size}-${name}`, async() => {
				const elem = await fixture(createState(opts), { viewport: { width } });
				await expect(elem).to.be.golden();
			});
		});
	});

	it('custom-svg', async() => {
		const elem = await fixture(html`
			<d2l-state-illustrated
				title-text="No Learning Paths Yet"
				description="Get started by clicking below to create your first learning path.">
				<svg slot="illustration" width="400" height="100">
					<rect width="400" height="100" style="fill: rgb(0, 0, 255); stroke: rgb(0, 0, 0); stroke-width: 3;" />
				</svg>
			</d2l-state-illustrated>
		`);
		await expect(elem).to.be.golden();
	});

	it('no-svg', async() => {
		const elem = await fixture(html`
			<d2l-state-illustrated
				title-text="No Learning Paths Yet"
				description="Get started by clicking below to create your first learning path.">
			</d2l-state-illustrated>
		`);
		await expect(elem).to.be.golden();
	});
});
