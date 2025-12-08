import '../button-segmented.js';
import { expect, fixture, focusElem, html, runConstructor, sendKeysElem } from '@brightspace-ui/testing';

describe('d2l-button-segmented', () => {

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-button-segmented');
		});

	});

	describe('focus', () => {
		let elem, items, after;
		beforeEach(async() => {
			const fixtureElem = await fixture(html`
				<d2l-button-segmented>
					<d2l-button-segmented-item key="saveAsDraft" text="Save as Draft"></d2l-button-segmented-item>
					<d2l-button-segmented-item selected key="saveAndClose" text="Save and Close"></d2l-button-segmented-item>
					<d2l-button-segmented-item key="saveAndNew" text="Save and New"></d2l-button-segmented-item>
				</d2l-button-segmented>
				<button id="after">After</button>
			`);
			elem = fixtureElem.querySelector('d2l-button-segmented');
			items = elem.querySelectorAll('d2l-button-segmented-item');
			after = elem.parentElement.querySelector('#after');
		});

		[
			{ name: 'should focus on first element by default', action: focusElem, expectedIndex: 0 },
			{
				name: 'should move focus out on tab',
				action: async() => {
					await focusElem(elem);
					await sendKeysElem(elem, 'press', 'Tab');
				},
				expectedIndex: -1
			},
			{
				name: 'should move focus to next element on right arrow',
				action: async() => {
					await focusElem(elem);
					await sendKeysElem(elem, 'press', 'ArrowRight');
				},
				expectedIndex: 1
			},
			{
				name: 'should move focus to previous element on left arrow',
				action: async() => {
					await focusElem(elem);
					await sendKeysElem(elem, 'press', 'ArrowRight');
					await sendKeysElem(elem, 'press', 'ArrowLeft');
				},
				expectedIndex: 0
			},
			{
				name: 'should move focus to previously focused element when refocusing',
				action: async() => {
					await focusElem(elem);
					await sendKeysElem(elem, 'press', 'ArrowRight');
					await sendKeysElem(elem, 'press', 'Tab');
					await focusElem(elem);
				},
				expectedIndex: 1
			},
		].forEach(({ name, action, expectedIndex }) => {
			it(name, async() => {
				if (action) await action(elem);
				const expectedItem = expectedIndex === -1 ? after : items[expectedIndex];
				expect(document.activeElement).to.equal(expectedItem);
			});
		});

	});

});
