import { buttonIteratorFixtures, getNext, getNextOnly, getPrevious } from './button-iterator-fixtures.js';
import { clickElem, expect, fixture, focusElem, oneEvent, runConstructor } from '@brightspace-ui/testing';
import { getComposedActiveElement } from '../../../helpers/focus.js';

describe('d2l-button-iterator', () => {

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-button-iterator');
		});
	});

	describe('events', () => {
		[
			{ name: 'previous', template: buttonIteratorFixtures.default, button: getPrevious, expectedEvent: 'd2l-button-iterator-previous-click' },
			{ name: 'next', template: buttonIteratorFixtures.default, button: getNext, expectedEvent: 'd2l-button-iterator-next-click' },
			{ name: 'next-only', template: buttonIteratorFixtures.nextOnly, button: getNextOnly, expectedEvent: 'd2l-button-iterator-next-click' },
		].forEach(({ name, template, button, expectedEvent }) => {
			it(name, async() => {
				const elem = await fixture(template);
				clickElem(button(elem));
				await oneEvent(elem, expectedEvent);
			});
		});

		[
			{ name: 'previous-disabled', template: buttonIteratorFixtures.disabled, button: getPrevious },
			{ name: 'next-disabled', template: buttonIteratorFixtures.disabled, button: getNext }
		].forEach(({ name, template, button }) => {
			it(name, async() => {
				const elem = await fixture(template);
				let eventDispatched = false;
				elem.addEventListener('d2l-button-iterator-next-click', () => eventDispatched = true);
				elem.addEventListener('d2l-button-iterator-previous-click', () => eventDispatched = true);

				await clickElem(button(elem));

				expect(eventDispatched).to.be.false;
			});
		});
	});

	describe('focus', () => {
		it('should delegate focus to the previous button', async() => {
			const elem = await fixture(buttonIteratorFixtures.default);
			await focusElem(elem);
			expect(getComposedActiveElement()).to.equal(getPrevious(elem));
		});

		it('should delegate focus to the next button when previous disabled', async() => {
			const elem = await fixture(buttonIteratorFixtures.disabledPrev);
			await focusElem(elem);
			expect(getComposedActiveElement()).to.equal(getNext(elem));
		});
	});
});
