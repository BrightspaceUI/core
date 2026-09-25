import '../../state/state-action-button.js';
import '../../state/state-action-link.js';
import '../empty-state-simple.js';
import { expect, fixture, focusElem, oneEvent, runConstructor } from '@brightspace-ui/testing';
import { getComposedActiveElement } from '../../../helpers/focus.js';
import { html } from 'lit';

const noActionFixture = html`
	<d2l-empty-state-simple description="There are no assignments to display."></d2l-empty-state-simple>
`;

const actionButtonFixture = html`
	<d2l-empty-state-simple
		description="There are no assignments to display.">
		<d2l-state-action-button
			text="Create New Assignment">
		</d2l-state-action-button>
	</d2l-empty-state-simple>
`;

const actionLinkFixture = html`
	<d2l-empty-state-simple
		description="There are no assignments to display.">
		<d2l-state-action-link
			text="Create New Assignment"
			href="#">
		</d2l-state-action-link>
	</d2l-empty-state-simple>
`;

describe('d2l-empty-state-simple', () => {

	it('should construct empty-state-simple', () => {
		runConstructor('d2l-empty-state-simple');
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
