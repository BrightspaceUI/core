import '../state-action-button.js';
import '../state-action-link.js';
import '../state-simple.js';
import { clickElem, expect, fixture, focusElem, oneEvent, runConstructor } from '@brightspace-ui/testing';
import { getComposedActiveElement } from '../../../helpers/focus.js';
import { html } from 'lit';

const noActionFixture = html`
	<d2l-state-simple description="There are no assignments to display."></d2l-state-simple>
`;

const actionButtonFixture = html`
	<d2l-state-simple
		description="There are no assignments to display.">
		<d2l-state-action-button
			text="Create New Assignment">
		</d2l-state-action-button>
	</d2l-state-simple>
`;

const actionLinkFixture = html`
	<d2l-state-simple
		description="There are no assignments to display.">
		<d2l-state-action-link
			text="Create New Assignment"
			href="#">
		</d2l-state-action-link>
	</d2l-state-simple>
`;

describe('d2l-state-simple', () => {

	it('should construct state-simple', () => {
		runConstructor('d2l-state-simple');
	});

	it('should construct state-action-button', () => {
		runConstructor('d2l-state-action-button');
	});

	it('should construct state-action-link', () => {
		runConstructor('d2l-state-action-link');
	});

	it('dispatches d2l-state-action when action is clicked', async() => {
		const el = await fixture(actionButtonFixture);
		const button = el.querySelector('d2l-state-action-button');
		clickElem(button.shadowRoot.querySelector('d2l-button-subtle'));
		await oneEvent(button, 'd2l-state-action');
	});

	it('dispatches click event when action link is clicked', async() => {
		const el = await fixture(actionLinkFixture);
		const link = el.querySelector('d2l-state-action-link');
		clickElem(link.shadowRoot.querySelector('a'));
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
