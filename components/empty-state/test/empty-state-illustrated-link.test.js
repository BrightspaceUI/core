import '../empty-state-illustrated-link.js';
import { fixture, html, oneEvent } from '@open-wc/testing';
import { runConstructor } from '../../../tools/constructor-test-helper.js';

describe('d2l-empty-state-illustrated-link',  () => {

	it('should construct', () => {
		runConstructor('d2l-empty-state-illustrated-link');
	});

	it('dispatches click event when action is clicked', async() => {
		const el = await fixture(html`
			<d2l-empty-state-illustrated-link illustration-name="tumbleweed" title-text="No Learning Paths Yet" description="Get started by clicking below to create your first learning path." action-text="Create Learning Paths" action-href="#"></d2l-empty-state-illustrated-link>
		`);
		setTimeout(() => el.shadowRoot.querySelector('a').click());
		await oneEvent(el, 'click');
	});

});
