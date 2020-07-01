import '../input-date-range.js';
import { expect, fixture, oneEvent } from '@open-wc/testing';
import { getDocumentLocaleSettings } from '@brightspace-ui/intl/lib/common.js';
import { runConstructor } from '../../../tools/constructor-test-helper.js';

const basicFixture = '<d2l-input-date-range label="label text"></d2l-input-date-range>';

function dispatchEvent(elem, eventType) {
	const e = new Event(
		eventType,
		{ bubbles: true, composed: true }
	);
	elem.dispatchEvent(e);
}

function getChildElem(elem, selector) {
	return elem.shadowRoot.querySelector(selector);
}

describe('d2l-input-date-range', () => {
	const documentLocaleSettings = getDocumentLocaleSettings();
	documentLocaleSettings.timezone.identifier = 'America/Toronto';

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-input-date-range');
		});

	});

	describe('values', () => {
		it('should fire "change" event when start value changes', async() => {
			const elem = await fixture(basicFixture);
			const inputElem = getChildElem(elem, 'd2l-input-date.d2l-input-date-range-start');
			inputElem.value = '2018-02-02';
			setTimeout(() => dispatchEvent(inputElem, 'change'));
			await oneEvent(elem, 'change');
			expect(elem.startValue).to.equal('2018-02-02');
		});
		it('should fire "change" event when end value changes', async() => {
			const elem = await fixture(basicFixture);
			const inputElem = getChildElem(elem, 'd2l-input-date.d2l-input-date-range-end');
			inputElem.value = '2018-10-31';
			setTimeout(() => dispatchEvent(inputElem, 'change'));
			await oneEvent(elem, 'change');
			expect(elem.endValue).to.equal('2018-10-31');
		});

		it('should default start and end values to undefined', async() => {
			const elem = await fixture(basicFixture);
			expect(elem.startValue).to.equal(undefined);
			expect(elem.endValue).to.equal(undefined);
		});

	});

});
