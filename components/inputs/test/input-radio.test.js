import { clickElem, expect, fixture, focusElem, html, oneEvent, runConstructor, sendKeysElem } from '@brightspace-ui/testing';
import { findComposedAncestor } from '../../../helpers/dom.js';
import { getComposedActiveElement } from '../../../helpers/focus.js';
import { radioFixtures } from './input-radio-fixtures.js';

function expectActive(value, checked) {
	const activeRadio = getActiveRadio();
	expect(activeRadio).to.not.be.null;
	expect(activeRadio.value).to.equal(value);
	expect(activeRadio.checked).to.equal(checked);
}

function getActiveRadio() {
	const activeElement = getComposedActiveElement();
	const activeRadio = findComposedAncestor(
		activeElement,
		(e) => e.tagName === 'D2L-INPUT-RADIO'
	);
	return activeRadio;
}

describe('d2l-input-radio', () => {

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-input-radio');
		});

	});

	describe('clicking', () => {

		it('should not check the radio if disabled', async() => {
			const elem = await fixture(radioFixtures.disabledFirstNoneChecked);
			const firstRadio = elem.querySelector('d2l-input-radio[value="1"]');
			await clickElem(firstRadio);
			expect(firstRadio.checked).to.be.false;
		});

		it('should check the radio and focus when clicked', async() => {
			const elem = await fixture(radioFixtures.secondChecked);
			const firstRadio = elem.querySelector('d2l-input-radio[value="1"]');
			await clickElem(firstRadio);
			expectActive('1', true);
		});

	});

	describe('events', () => {

		it('should fire change event when clicked', async() => {
			const elem = await fixture(radioFixtures.secondChecked);
			clickElem(elem.querySelector('d2l-input-radio[value="1"]'));
			const event = await oneEvent(elem, 'change');
			expect(event.detail.value).to.equal('1');
			expect(event.detail.oldValue).to.equal('2');
		});

		it('should not fire change event when clicked if no change', async() => {
			const elem = await fixture(radioFixtures.secondChecked);
			let eventFired = false;
			elem.addEventListener('change', () => eventFired = true);
			clickElem(elem.querySelector('d2l-input-radio[value="2"]'));
			expect(eventFired).to.be.false;
		});

		it('should fire change event when arrowed', async() => {
			const elem = await fixture(radioFixtures.secondChecked);
			sendKeysElem(elem, 'press', 'ArrowDown');
			const event = await oneEvent(elem, 'change');
			expect(event.detail.value).to.equal('3');
			expect(event.detail.oldValue).to.equal('2');
		});

		it('should fire change event when first radio is checked if none are checked', async() => {
			const elem = await fixture(radioFixtures.noneChecked);
			sendKeysElem(elem, 'press', ' ');
			const event = await oneEvent(elem, 'change');
			expect(event.detail.value).to.equal('1');
			expect(event.detail.oldValue).to.be.undefined;
		});

	});

	describe('focus management', () => {

		it('should focus on the checked item', async() => {
			const elem = await fixture(radioFixtures.secondChecked);
			await focusElem(elem);
			expectActive('2', true);
		});

		it('should not focus at all if the checked item is disabled', async() => {
			const elem = await fixture(radioFixtures.disabledChecked);
			await focusElem(elem);
			expect(getComposedActiveElement().tagName).to.equal('BODY');
		});

		it('should not focus at all if all items are disabled', async() => {
			const elem = await fixture(radioFixtures.disabledAllSecondChecked);
			await focusElem(elem);
			expect(getComposedActiveElement().tagName).to.equal('BODY');
		});

		it('should focus on the first item but not check it if none are checked', async() => {
			const elem = await fixture(radioFixtures.noneChecked);
			await focusElem(elem);
			expectActive('1', false);
		});

		it('should focus on the first non-disabled item but not check it if none are checked', async() => {
			const elem = await fixture(radioFixtures.disabledFirstNoneChecked);
			await focusElem(elem);
			expectActive('2', false);
		});

	});

	describe('keyboard', () => {

		it('should check the first item if all are unchecked on space', async() => {
			const elem = await fixture(radioFixtures.noneChecked);
			await sendKeysElem(elem, 'press', ' ');
			expectActive('1', true);
		});

		it('should check the first non-disabled item if all are unchecked on space', async() => {
			const elem = await fixture(radioFixtures.disabledFirstNoneChecked);
			await sendKeysElem(elem, 'press', ' ');
			expectActive('2', true);
		});

		it('should not toggle checked state on space once checked', async() => {
			const elem = await fixture(radioFixtures.secondChecked);
			await sendKeysElem(elem, 'press', ' ');
			expectActive('2', true);
		});

		it('should check the next item on arrow RIGHT (LTR)', async() => {
			const elem = await fixture(radioFixtures.secondChecked);
			await sendKeysElem(elem, 'press', 'ArrowRight');
			expectActive('3', true);
		});

		it('should check the next item on arrow DOWN', async() => {
			const elem = await fixture(radioFixtures.secondChecked);
			await sendKeysElem(elem, 'press', 'ArrowDown');
			expectActive('3', true);
		});

		it('should check the previous item on arrow LEFT (LTR)', async() => {
			const elem = await fixture(radioFixtures.secondChecked);
			await sendKeysElem(elem, 'press', 'ArrowLeft');
			expectActive('1', true);
		});

		it('should check the previous item on arrow UP', async() => {
			const elem = await fixture(radioFixtures.secondChecked);
			await sendKeysElem(elem, 'press', 'ArrowUp');
			expectActive('1', true);
		});

		it('should wrap to the beginning when arrow past the end', async() => {
			const elem = await fixture(radioFixtures.secondChecked);
			await sendKeysElem(elem, 'press', 'ArrowDown');
			await sendKeysElem(elem, 'press', 'ArrowDown');
			expectActive('1', true);
		});

		it('should wrap to the end when arrow past the beginning', async() => {
			const elem = await fixture(radioFixtures.secondChecked);
			await sendKeysElem(elem, 'press', 'ArrowUp');
			await sendKeysElem(elem, 'press', 'ArrowUp');
			expectActive('3', true);
		});

		it('should skip disabled items when arrowing', async() => {
			const elem = await fixture(radioFixtures.secondCheckedThirdDisabled);
			await sendKeysElem(elem, 'press', 'ArrowDown');
			expectActive('1', true);
		});

	});

	it('should treat the last checked item as the only checked item', async() => {
		const elem = await fixture(html`
			<d2l-input-radio-group label="One, two or three?">
				<d2l-input-radio label="One" value="1" checked></d2l-input-radio>
				<d2l-input-radio label="Two" value="2" checked></d2l-input-radio>
				<d2l-input-radio label="Three" value="3" checked></d2l-input-radio>
			</d2l-input-radio-group>
		`);
		const radios = elem.querySelectorAll('d2l-input-radio');
		expect(radios[0].checked).to.be.false;
		expect(radios[1].checked).to.be.false;
		expect(radios[2].checked).to.be.true;
	});

});
