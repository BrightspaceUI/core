import '../empty-state-action-button.js';
import '../empty-state-action-link.js';
import '../empty-state-simple.js';
import { fixture, oneEvent, runConstructor } from '@brightspace-ui/testing';
import { html } from 'lit';

describe('d2l-empty-state-simple',  () => {

	it('should construct empty-state-simple', () => {
		runConstructor('d2l-empty-state-simple');
	});

	it('should construct empty-state-action-button', () => {
		runConstructor('d2l-empty-state-action-button');
	});

	it('should construct empty-state-action-link', () => {
		runConstructor('d2l-empty-state-action-link');
	});

	it('dispatches d2l-empty-state-action when action is clicked', async() => {
		const el = await fixture(html`
			<d2l-empty-state-simple
				description="There are no assignments to display.">
				<d2l-empty-state-action-button
					text="Create New Assignment">
				</d2l-empty-state-action-button>
			</d2l-empty-state-simple>
		`);
		const button = el.querySelector('d2l-empty-state-action-button');
		setTimeout(() => button.shadowRoot.querySelector('d2l-button-subtle').click());
		await oneEvent(button, 'd2l-empty-state-action');
	});

	it('dispatches click event when action link is clicked', async() => {
		const el = await fixture(html`
			<d2l-empty-state-simple
				description="There are no assignments to display.">
				<d2l-empty-state-action-link
					text="Create New Assignment"
					href="#">
				</d2l-empty-state-action-link>
			</d2l-empty-state-simple>
		`);
		const link = el.querySelector('d2l-empty-state-action-link');
		setTimeout(() => link.shadowRoot.querySelector('a').click());
		await oneEvent(link, 'click');
	});

});
