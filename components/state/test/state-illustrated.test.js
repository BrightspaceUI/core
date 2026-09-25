import '../state-illustrated.js';
import '../state-action-button.js';
import '../state-action-link.js';
import { expect, fixture, focusElem, oneEvent, runConstructor, waitUntil } from '@brightspace-ui/testing';
import { getComposedActiveElement } from '../../../helpers/focus.js';
import { html } from 'lit';

const noActionFixture = html`
	<d2l-state-illustrated
		illustration-name="fish-hook"
		title-text="No Learning Paths Yet"
		description="Get started by clicking below to create your first learning path."></d2l-state-illustrated>
`;

const actionButtonFixture = html`
	<d2l-state-illustrated
		illustration-name="tumbleweed"
		title-text="No Learning Paths Yet"
		description="Get started by clicking below to create your first learning path.">
		<d2l-state-action-button
			text="Create Learning Paths">
		</d2l-state-action-button>
	</d2l-state-illustrated>
`;

const actionLinkFixture = html`
	<d2l-state-illustrated
		illustration-name="tumbleweed"
		title-text="No Learning Paths Yet"
		description="Get started by clicking below to create your first learning path.">
		<d2l-state-action-link
			text="Create Learning Paths"
			href="#">
		</d2l-state-action-link>
	</d2l-state-illustrated>
`;

describe('d2l-state-illustrated', () => {

	it('should construct', () => {
		runConstructor('d2l-state-illustrated');
	});

	it('dispatches d2l-state-action when action is clicked when using the default subtle button', async() => {
		const el = await fixture(actionButtonFixture);
		const button = el.querySelector('d2l-state-action-button');
		setTimeout(() => button.shadowRoot.querySelector('d2l-button-subtle').click());
		await oneEvent(button, 'd2l-state-action');
	});

	it('dispatches d2l-state-action when action is clicked when using a primary button', async() => {
		const el = await fixture(html`
			<d2l-state-illustrated
				illustration-name="tumbleweed"
				title-text="No Learning Paths Yet"
				description="Get started by clicking below to create your first learning path.">
				<d2l-state-action-button
					text="Create Learning Paths"
					primary>
				</d2l-state-action-button>
			</d2l-state-illustrated>
		`);
		const button = el.querySelector('d2l-state-action-button');

		// Wait for primary button to render
		await waitUntil(() => button.shadowRoot.querySelector('d2l-button') !== null, 'Primary button should render', { timeout: 5000 });

		setTimeout(() => button.shadowRoot.querySelector('d2l-button').click());
		await oneEvent(button, 'd2l-state-action');
	});

	it('dispatches click event when action link is clicked', async() => {
		const el = await fixture(actionLinkFixture);
		const link = el.querySelector('d2l-state-action-link');
		setTimeout(() => link.shadowRoot.querySelector('a').click());
		await oneEvent(link, 'click');
	});

	describe('focus', () => {

		it('should focus on description when no action is present', async() => {
			const el = await fixture(noActionFixture);
			const description = el.shadowRoot.querySelector('.d2l-state-description');
			await focusElem(el);
			const areEqual = getComposedActiveElement() === description;
			expect(areEqual).to.be.true;
		});

		it('should focus on action button', async() => {
			const el = await fixture(actionButtonFixture);
			const button = el
				.querySelector('d2l-state-action-button')
				.shadowRoot.querySelector('d2l-button-subtle')
				.shadowRoot.querySelector('button');
			await focusElem(el);
			const areEqual = getComposedActiveElement() === button;
			expect(areEqual).to.be.true;
		});

		it('should focus on action link', async() => {
			const el = await fixture(actionLinkFixture);
			const link = el
				.querySelector('d2l-state-action-link')
				.shadowRoot.querySelector('a');
			await focusElem(el);
			const areEqual = getComposedActiveElement() === link;
			expect(areEqual).to.be.true;
		});

	});

});
