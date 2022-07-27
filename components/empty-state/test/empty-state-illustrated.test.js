import '../empty-state-illustrated.js';
import '../empty-state-action-button.js';
import '../empty-state-action-link.js';
import { fixture, oneEvent } from '@open-wc/testing';
import { html } from 'lit';
import { runConstructor } from '../../../tools/constructor-test-helper.js';

describe('d2l-empty-state-illustrated',  () => {

	it('should construct', () => {
		runConstructor('d2l-empty-state-illustrated');
	});

	it('dispatches d2l-empty-state-action when action is clicked when using the default subtle button', async() => {
		const el = await fixture(html`
			<d2l-empty-state-illustrated
				illustration-name="tumbleweed"
				title-text="No Learning Paths Yet"
				description="Get started by clicking below to create your first learning path.">
				<d2l-empty-state-action-button
					text="Create Learning Paths">
				</d2l-empty-state-action-button>
			</d2l-empty-state-illustrated>
		`);
		const button = el.querySelector('d2l-empty-state-action-button');
		setTimeout(() => button.shadowRoot.querySelector('d2l-button-subtle').click());
		await oneEvent(el, 'd2l-empty-state-action');
	});

	it('dispatches d2l-empty-state-action when action is clicked when using a primary button', async() => {
		const el = await fixture(html`
			<d2l-empty-state-illustrated
				illustration-name="tumbleweed"
				title-text="No Learning Paths Yet"
				description="Get started by clicking below to create your first learning path.">
				<d2l-empty-state-action-button
					text="Create Learning Paths"
					primary>
				</d2l-empty-state-action-button>
			</d2l-empty-state-illustrated>
		`);
		const button = el.querySelector('d2l-empty-state-action-button');

		// Wait for _illustrated attribute to be set in d2l-empty-state-action-button
		setTimeout(() => {
			button.shadowRoot.querySelector('d2l-button').click();
		}, 1000);
		await oneEvent(el, 'd2l-empty-state-action');
	});

	it('dispatches click event when action link is clicked', async() => {
		const el = await fixture(html`
			<d2l-empty-state-illustrated
				illustration-name="tumbleweed"
				title-text="No Learning Paths Yet"
				description="Get started by clicking below to create your first learning path.">
				<d2l-empty-state-action-link
					text="Create Learning Paths"
					href="#">
				</d2l-empty-state-action-link>
			</d2l-empty-state-illustrated>
		`);
		const link = el.querySelector('d2l-empty-state-action-link');
		setTimeout(() => link.shadowRoot.querySelector('a').click());
		await oneEvent(el, 'click');
	});

});
