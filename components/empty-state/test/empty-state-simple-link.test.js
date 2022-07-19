import '../empty-state-simple-link.js';
import { fixture, html, oneEvent } from '@open-wc/testing';
import { runConstructor } from '../../../tools/constructor-test-helper.js';

describe('d2l-empty-state-simple-link',  () => {

	it('should construct', () => {
		runConstructor('d2l-empty-state-simple-link');
	});

	it('dispatches click event when action is clicked', async() => {
		const el = await fixture(html`<d2l-empty-state-simple-link action-text="Create New Assignment" action-href="#"></d2l-empty-state-simple-link>`);
		setTimeout(() => el.shadowRoot.querySelector('a').click());
		await oneEvent(el, 'click');
	});

});
