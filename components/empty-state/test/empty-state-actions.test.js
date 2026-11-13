import '../empty-state-action-button.js';
import '../empty-state-action-link.js';
import { clickElem, fixture, oneEvent, runConstructor } from '@brightspace-ui/testing';
import { html } from 'lit';

describe('d2l-state-actions', () => {

	it('should construct empty-state-action-button', () => {
		runConstructor('d2l-empty-state-action-button');
	});

	it('should construct empty-state-action-link', () => {
		runConstructor('d2l-empty-state-action-link');
	});

	it('dispatches d2l-empty-state-action when action is clicked', async() => {
		const button = await fixture(html`<d2l-empty-state-action-button
			text="Create New Assignment">
		</d2l-empty-state-action-button>`);
		clickElem(button.shadowRoot.querySelector('d2l-button-subtle'));
		await oneEvent(button, 'd2l-empty-state-action');
	});

	it('dispatches click event when action link is clicked', async() => {
		const link = await fixture(html`<d2l-empty-state-action-link
			text="Create New Assignment"
			href="#">
		</d2l-empty-state-action-link>`);
		clickElem(link.shadowRoot.querySelector('a'));
		await oneEvent(link, 'click');
	});

});
