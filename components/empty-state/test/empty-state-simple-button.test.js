import '../empty-state-simple-button.js';
import { fixture, html, oneEvent } from '@open-wc/testing';
import { runConstructor } from '../../../tools/constructor-test-helper.js';

describe('d2l-empty-state-simple-button',  () => {

	it('should construct', () => {
		runConstructor('d2l-empty-state-simple-button');
	});

	it('dispatches d2l-empty-state-action when action is clicked', async() => {
		const el = await fixture(html`<d2l-empty-state-simple-button action-text='Create New Assignment'></d2l-empty-state-simple-button>`);
		setTimeout(() => el.shadowRoot.querySelector('d2l-button-subtle').click());
		await oneEvent(el, 'd2l-empty-state-action');
	});

});
