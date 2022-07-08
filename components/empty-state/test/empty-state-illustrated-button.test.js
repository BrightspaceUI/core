import '../empty-state-illustrated-button.js';
import { fixture, html, oneEvent } from '@open-wc/testing';
import { runConstructor } from '../../../tools/constructor-test-helper.js';

describe('d2l-empty-state-illustrated-button',  () => {

	it('should construct', () => {
		runConstructor('d2l-empty-state-illustrated-button');
	});

	it('dispatches d2l-empty-state-action when action is clicked', async() => {
		const el = await fixture(html`
			<d2l-empty-state-illustrated-button illustration="tumbleweed" title-text="No Learning Paths Yet" description="Get started by clicking below to create your first learning path." action-text="Create Learning Paths"></d2l-empty-state-illustrated-button>
		`);
		setTimeout(() => el.shadowRoot.querySelector('d2l-button-subtle').click());
		await oneEvent(el, 'd2l-empty-state-action');
	});

});
