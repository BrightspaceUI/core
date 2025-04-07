import '../empty-state-illustrated.js';
import '../empty-state-action-button.js';
import '../empty-state-action-link.js';
import { expect, fixture, focusElem, oneEvent, runConstructor, waitUntil } from '@brightspace-ui/testing';
import { getComposedActiveElement } from '../../../helpers/focus.js';
import { html } from 'lit';

const noActionFixture = html`
	<d2l-empty-state-illustrated
		illustration-name="fish-hook"
		title-text="No Learning Paths Yet"
		description="Get started by clicking below to create your first learning path."></d2l-empty-state-illustrated>
`;

const actionButtonFixture = html`
	<d2l-empty-state-illustrated
		illustration-name="tumbleweed"
		title-text="No Learning Paths Yet"
		description="Get started by clicking below to create your first learning path.">
		<d2l-empty-state-action-button
			text="Create Learning Paths">
		</d2l-empty-state-action-button>
	</d2l-empty-state-illustrated>
`;

const actionLinkFixture = html`
	<d2l-empty-state-illustrated
		illustration-name="tumbleweed"
		title-text="No Learning Paths Yet"
		description="Get started by clicking below to create your first learning path.">
		<d2l-empty-state-action-link
			text="Create Learning Paths"
			href="#">
		</d2l-empty-state-action-link>
	</d2l-empty-state-illustrated>
`;

describe('d2l-empty-state-illustrated', () => {

	it('should construct', () => {
		runConstructor('d2l-empty-state-illustrated');
	});

	it('dispatches d2l-empty-state-action when action is clicked when using the default subtle button', async() => {
		const el = await fixture(actionButtonFixture);
		const button = el.querySelector('d2l-empty-state-action-button');
		setTimeout(() => button.shadowRoot.querySelector('d2l-button-subtle').click());
		await oneEvent(button, 'd2l-empty-state-action');
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

		// Wait for primary button to render
		await waitUntil(() => button.shadowRoot.querySelector('d2l-button') !== null, 'Primary button should render', { timeout: 5000 });

		setTimeout(() => button.shadowRoot.querySelector('d2l-button').click());
		await oneEvent(button, 'd2l-empty-state-action');
	});

	it('dispatches click event when action link is clicked', async() => {
		const el = await fixture(actionLinkFixture);
		const link = el.querySelector('d2l-empty-state-action-link');
		setTimeout(() => link.shadowRoot.querySelector('a').click());
		await oneEvent(link, 'click');
	});

	describe('focus', () => {

		it('should focus on description when no action is present', async() => {
			const el = await fixture(noActionFixture);
			const description = el.shadowRoot.querySelector('.d2l-empty-state-description');
			await focusElem(el);
			const areEqual = getComposedActiveElement() === description;
			expect(areEqual).to.be.true;
		});

		it('should focus on action button', async() => {
			const el = await fixture(actionButtonFixture);
			const button = el
				.querySelector('d2l-empty-state-action-button')
				.shadowRoot.querySelector('d2l-button-subtle')
				.shadowRoot.querySelector('button');
			await focusElem(el);
			const areEqual = getComposedActiveElement() === button;
			expect(areEqual).to.be.true;
		});

		it('should focus on action link', async() => {
			const el = await fixture(actionLinkFixture);
			const link = el
				.querySelector('d2l-empty-state-action-link')
				.shadowRoot.querySelector('a');
			await focusElem(el);
			const areEqual = getComposedActiveElement() === link;
			expect(areEqual).to.be.true;
		});

	});

});
