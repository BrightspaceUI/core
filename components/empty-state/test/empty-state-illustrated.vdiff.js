import '../empty-state-action-button.js';
import '../empty-state-action-link.js';
import '../empty-state-illustrated.js';
import { expect, fixture, html } from '@brightspace-ui/testing';
import { nothing } from 'lit';

function createState(opts) {
	const defaults = {
		content: nothing,
		description: 'Get started by clicking below to create your first learning path.'
	};
	const { content, description } = { ...defaults, ...opts };
	return html`
		<d2l-empty-state-illustrated illustration-name="desert-road" title-text="No Learning Paths Yet" description="${description}">
			${content}
		</d2l-empty-state-illustrated>
	`;
}

describe('empty-state-illustrated', () => {

	[
		{ name: 'no-action', opts: { description: 'Create a learning path to get started.' } },
		{ name: 'button', opts: { content: html`<d2l-empty-state-action-button text="Create Learning Paths"></d2l-empty-state-action-button>` } },
		{ name: 'link', opts: { content: html`<d2l-empty-state-action-link text="Create Learning Paths" href="#"></d2l-empty-state-action-link>` } },
	].forEach(({ name, opts }) => {
		it(`${name}`, async() => {
			const elem = await fixture(createState(opts));
			await expect(elem).to.be.golden();
		});
	});
});
