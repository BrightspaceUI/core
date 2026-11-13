import '../state-action-button.js';
import '../state-action-link.js';
import '../state-error-simple.js';
import { expect, fixture, html } from '@brightspace-ui/testing';
import { nothing } from 'lit';

function createState(opts) {
	const defaults = {
		content: nothing,
		description: 'Get started by clicking below to create your first learning path.'
	};
	const { content, description } = { ...defaults, ...opts };
	return html`
		<d2l-state-error-simple illustration-name="desert-road" title-text="No Learning Paths Yet" description="${description}" ?wrap-action="${opts.wrapAction}">
			${content}
		</d2l-state-error-simple>
	`;
}

describe('state-error-simple', () => {

	[
		{ name: 'no-action', opts: { description: 'Create a learning path to get started.' } },
		{ name: 'button', opts: { content: html`<d2l-state-action-button text="Create Learning Paths"></d2l-state-action-button>` } },
		{ name: 'link', opts: { content: html`<d2l-state-action-link text="Create Learning Paths" href="#"></d2l-state-action-link>` } },
		{ name: 'wrap-action', opts: { content: html`<d2l-state-action-link text="Create Learning Paths" href="#"></d2l-state-action-link>`, wrapAction: true } },
	].forEach(({ name, opts }) => {
		it(`${name}`, async() => {
			const elem = await fixture(createState(opts));
			await expect(elem).to.be.golden();
		});
	});
});
