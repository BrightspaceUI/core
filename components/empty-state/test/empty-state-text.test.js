import '../empty-state-text.js';
import { expect, fixture, html, oneEvent } from '@open-wc/testing';

import { runConstructor } from '../../../tools/constructor-test-helper.js';

describe('d2l-empty-state-text',  () => {
	it('should construct', () => {
		runConstructor('d2l-empty-state-text');
	});

	it('should render a span with the given description', async() => {
		const description = 'There are currently no courses.';
		const el = await fixture(html`<d2l-empty-state-text description=${description}></d2l-empty-state-text>`);
		expect(el.shadowRoot.querySelector('span').innerText).to.equal(description);
	});

	it('should render a subtle button with the action-text', async() => {

	});

	it('should not render a subtle button if no action-text is given', async() => {

	});

	it('should render a primary button from slot if no action-text is given', async() => {});

	it('should not render components in slot if action-text is given', async() => {

	});

	it('dispatches d2l-empty-state-action when action is clicked', async() => {

	});
});
