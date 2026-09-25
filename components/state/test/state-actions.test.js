import '../state-action-button.js';
import '../state-action-link.js';
import '../state-illustrated.js';
import { clickElem, expect, fixture, focusElem, oneEvent, runConstructor } from '@brightspace-ui/testing';
import { getComposedActiveElement } from '../../../helpers/focus.js';
import { html } from 'lit';

describe('d2l-state-actions', () => {

	it('should construct state-action-button', () => {
		runConstructor('d2l-state-action-button');
	});

	it('should construct state-action-link', () => {
		runConstructor('d2l-state-action-link');
	});

	it('dispatches d2l-state-action when action is clicked', async() => {
		const button = await fixture(html`<d2l-state-action-button
			text="Create New Assignment">
		</d2l-state-action-button>`);
		clickElem(button.shadowRoot.querySelector('d2l-button-subtle'));
		await oneEvent(button, 'd2l-state-action');
	});

	it('dispatches click event when action link is clicked', async() => {
		const link = await fixture(html`<d2l-state-action-link
			text="Create New Assignment"
			href="#">
		</d2l-state-action-link>`);
		clickElem(link.shadowRoot.querySelector('a'));
		await oneEvent(link, 'click');
	});

});
