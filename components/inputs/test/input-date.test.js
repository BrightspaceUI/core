import '../input-date.js';
import { aTimeout, expect, fixture, oneEvent } from '@open-wc/testing';

const basicFixture = '<d2l-input-date label="label text"></d2l-input-date>';
const labelHiddenFixture = '<d2l-input-date label="label text" label-hidden></d2l-input-date>';

function dispatchEvent(elem, eventType, composed) {
	const e = new Event(
		eventType,
		{ bubbles: true, cancelable: false, composed: composed }
	);
	elem.dispatchEvent(e);
}

function getInput(elem) {
	return elem.shadowRoot.querySelector('.d2l-input');
}

describe('d2l-input-date', () => {

	describe('accessibility', () => {

		it('passes all axe tests', async() => {
			const elem = await fixture(basicFixture);
			await expect(elem).to.be.accessible();
		});

		it('passes all axe tests when label is hidden', async() => {
			const elem = await fixture(labelHiddenFixture);
			await expect(elem).to.be.accessible();
		});

		it('passes all axe tests when disabled', async() => {
			const elem = await fixture('<d2l-input-date label="label text" disabled></d2l-input-date>');
			await expect(elem).to.be.accessible();
		});

		it('passes all axe tests when focused', async() => {
			const elem = await fixture(basicFixture);
			setTimeout(() => getInput(elem).focus());
			await oneEvent(elem, 'focus');
			await expect(elem).to.be.accessible();
		});
	});

	describe('labelling', () => {

		function getLabel(elem) {
			return elem.shadowRoot.querySelector('.d2l-input-label');
		}

		it('should display visible label', async() => {
			const elem = await fixture(basicFixture);
			expect(getLabel(elem).innerText).to.equal('label text');
		});

		it('should put hidden label on "aria-label"', async() => {
			const elem = await fixture(labelHiddenFixture);
			expect(getLabel(elem)).to.be.null;
			expect(getInput(elem).getAttribute('aria-label')).to.equal('label text');
		});
	});

	describe('value', () => {
		const dateInput = '2/8/2019';

		it('should fire uncomposed "d2l-input-date-change" event when input value changes', async() => {
			const elem = await fixture(basicFixture);
			const inputElem = getInput(elem);
			inputElem.value = dateInput;
			dispatchEvent(inputElem, 'change', false);
			await oneEvent(elem, 'd2l-input-date-change');
		});

		it('should not fire "d2l-input-date-change" event when input value is invalid', async() => {
			const elem = await fixture(basicFixture);
			const inputElem = getInput(elem);
			let fired = false;
			elem.addEventListener('d2l-input-date-change', () => {
				fired = true;
			});
			inputElem.value = 'invalid input text';
			dispatchEvent(inputElem, 'change', false);
			await aTimeout(1);
			expect(fired).to.be.false;
		});

		it('should change "value" property when input value changes', async() => {
			const elem = await fixture(basicFixture);
			const inputElem = getInput(elem);
			inputElem.value = dateInput;
			dispatchEvent(inputElem, 'change', false);
			await oneEvent(elem, 'd2l-input-date-change');
			expect(elem.value).to.equal('2019-02-08');
		});

		it('should default to undefined', async() => {
			const elem = await fixture(basicFixture);
			expect(elem.value).to.equal(undefined);
		});

	});

});
