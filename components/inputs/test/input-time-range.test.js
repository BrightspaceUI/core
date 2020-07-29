import '../input-time-range.js';
import { aTimeout, expect, fixture, oneEvent } from '@open-wc/testing';
import { getDocumentLocaleSettings } from '@brightspace-ui/intl/lib/common.js';
import { runConstructor } from '../../../tools/constructor-test-helper.js';

const basicFixture = '<d2l-input-time-range label="label text"></d2l-input-time-range>';

function dispatchEvent(elem, eventType) {
	const e = new Event(
		eventType,
		{ bubbles: true, composed: false }
	);
	elem.dispatchEvent(e);
}

function getChildElem(elem, selector) {
	return elem.shadowRoot.querySelector(selector);
}

describe('d2l-input-time-range', () => {
	const documentLocaleSettings = getDocumentLocaleSettings();
	documentLocaleSettings.timezone.identifier = 'America/Toronto';

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-input-time-range');
		});

	});

	describe('values', () => {
		it('should fire "change" event when start value changes', async() => {
			const elem = await fixture(basicFixture);
			const inputElem = getChildElem(elem, 'd2l-input-time.d2l-input-time-range-start');
			inputElem.value = '01:30:00';
			setTimeout(() => dispatchEvent(inputElem, 'change'));
			await oneEvent(elem, 'change');
			expect(elem.startValue).to.equal('1:30:00');
		});
		it('should fire "change" event when end value changes', async() => {
			const elem = await fixture(basicFixture);
			const inputElem = getChildElem(elem, 'd2l-input-time.d2l-input-time-range-end');
			inputElem.value = '23:00:00';
			setTimeout(() => dispatchEvent(inputElem, 'change'));
			await oneEvent(elem, 'change');
			expect(elem.endValue).to.equal('23:00:00');
		});

		it('should default start and end values to 12 am and 12:30 am', async() => {
			const elem = await fixture(basicFixture);
			expect(elem.startValue).to.equal('00:00:00');
			expect(elem.endValue).to.equal('00:30:00');
		});

		describe('validation', () => {
			it('should be valid if start time and no end time and start time changed to value before default end', async() => {
				const elem = await fixture(basicFixture);
				const inputElem = getChildElem(elem, 'd2l-input-time.d2l-input-time-range-start');
				inputElem.value = '00:15:00';
				setTimeout(() => dispatchEvent(inputElem, 'change'));
				await oneEvent(elem, 'change');
				expect(elem.startValue).to.equal('0:15:00');
				expect(elem.endValue).to.equal('00:30:00');
				expect(elem.invalid).to.be.false;
				expect(elem.validationError).to.be.null;
			});

			it('should be valid if end time and no start time', async() => {
				const elem = await fixture(basicFixture);
				const inputElem = getChildElem(elem, 'd2l-input-time.d2l-input-time-range-end');
				inputElem.value = '18:30:00';
				setTimeout(() => dispatchEvent(inputElem, 'change'));
				await oneEvent(elem, 'change');
				expect(elem.startValue).to.equal('00:00:00');
				expect(elem.endValue).to.equal('18:30:00');
				expect(elem.invalid).to.be.false;
				expect(elem.validationError).to.be.null;
			});

			it('should be valid if start time before end time', async() => {
				const elem = await fixture(basicFixture);
				await updateStartEnd(elem, '12:30:00', '16:25:00');
				expect(elem.invalid).to.be.false;
				expect(elem.validationError).to.be.null;
			});

			it('should be invalid if start time equals end time', async() => {
				const elem = await fixture(basicFixture);
				await updateStartEnd(elem, '14:00:00', '14:00:00');
				expect(elem.invalid).to.be.true;
				expect(elem.validationError).to.equal('Start Time must be before End Time');
			});

			it('should be invalid if start time after end time', async() => {
				const elem = await fixture(basicFixture);
				await updateStartEnd(elem, '13:00:00', '11:10:12');
				expect(elem.invalid).to.be.true;
				expect(elem.validationError).to.equal('Start Time must be before End Time');
			});

			async function updateStartEnd(elem, startDate, endDate) {
				let firedCount = 0;
				elem.addEventListener('change', () => {
					firedCount++;
				});

				const inputElemStart = getChildElem(elem, 'd2l-input-time.d2l-input-time-range-start');
				inputElemStart.value = startDate;
				setTimeout(() => dispatchEvent(inputElemStart, 'change'));
				await oneEvent(elem, 'change');
				expect(elem.startValue).to.equal(startDate);

				const inputElemEnd = getChildElem(elem, 'd2l-input-time.d2l-input-time-range-end');
				inputElemEnd.value = endDate;
				setTimeout(() => dispatchEvent(inputElemEnd, 'change'));
				await oneEvent(inputElemEnd, 'change');
				expect(elem.endValue).to.equal(endDate);

				await aTimeout(1);
				expect(firedCount).to.equal(2);
			}

		});

	});

});
