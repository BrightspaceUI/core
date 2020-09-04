import '../input-time.js';
import { aTimeout, expect, fixture, oneEvent } from '@open-wc/testing';
import { runConstructor } from '../../../tools/constructor-test-helper.js';

const basicFixture = '<d2l-input-time label="label text"></d2l-input-time>';
const fixtureWithValue = '<d2l-input-time value="11:22:33"></d2l-input-time>';
const hourLongIntervals = '<d2l-input-time label="label text" time-interval="sixty"></d2l-input-time>';
const hourLongIntervalsEnforced = '<d2l-input-time label="label text" time-interval="sixty" enforce-time-intervals></d2l-input-time>';
const labelHiddenFixture = '<d2l-input-time label="label text" label-hidden time-interval="sixty"></d2l-input-time>';

function dispatchEvent(elem, eventType, composed) {
	const e = new Event(
		eventType,
		{ bubbles: true, cancelable: false, composed: composed }
	);
	getInput(elem).dispatchEvent(e);
}

function getInput(elem) {
	return elem.shadowRoot.querySelector('.d2l-input');
}
function getFirstOption(elem) {
	return [...elem.shadowRoot.querySelector('.d2l-input-time-menu').childNodes].find(item => item.role === 'menuitemradio');
}
function getNumberOfIntervals(elem) {
	return elem.shadowRoot.querySelectorAll('.d2l-input-time-menu d2l-menu-item-radio').length;
}

describe('d2l-input-time', () => {

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-input-time');
		});

	});

	describe('labelling', () => {

		it('should display visible label', async() => {
			const elem = await fixture(basicFixture);
			expect(elem.shadowRoot.querySelector('.d2l-input-label').innerText).to.equal('label text');
		});

		it('should create offscreen label when label-hidden', async() => {
			const elem = await fixture(labelHiddenFixture);
			expect(elem.shadowRoot.querySelector('.d2l-offscreen').innerText).to.equal('label text');
		});
	});

	describe('value', () => {

		it('should fire uncomposed "change" event when input value changes', async() => {
			const elem = await fixture(basicFixture);
			getInput(elem).value = '11:22AM';
			dispatchEvent(elem, 'change', false);
			await oneEvent(elem, 'change');
		});

		it('should not fire "change" event when input value is invalid', async() => {
			const elem = await fixture(basicFixture);
			let fired = false;
			elem.addEventListener('change', () => {
				fired = true;
			});
			getInput(elem).value = 'invalid input text';
			dispatchEvent(elem, 'change', false);
			await aTimeout(1);
			expect(fired).to.be.false;
		});

		it('should change "value" property when input value changes', async() => {
			const elem = await fixture(basicFixture);
			getInput(elem).value = '11:22AM';
			dispatchEvent(elem, 'change', false);
			await oneEvent(elem, 'change');
			expect(elem.value).to.equal('11:22:00');
		});

		it('should provide a time object with hour, minute and second', async() => {
			const elem = await fixture(fixtureWithValue);
			expect(elem.getTime()).to.deep.equal({ hours: 11, minutes: 22, seconds: 33 });
		});

		it('should default to 12 AM', async() => {
			const elem = await fixture(basicFixture);
			expect(elem.value).to.equal('00:00:00');
		});

		it('should apply custom default value', async() => {
			const elem = await fixture('<d2l-input-time label="label text" default-value="02:00:00"></d2l-input-time>');
			expect(elem.value).to.equal('02:00:00');
		});

		it('should throw an error with invalid default value', async() => {
			const elem = await fixture('<d2l-input-time label="label text"></d2l-input-time>');
			elem.defaultValue = 'potato';
			expect(() => elem.value = '') //clear given value and parse/assign default
				.to.throw('Invalid input: Expected format is hh:mm:ss');
		});

		it('should apply default value from keyword: startOfDay', async() => {
			const elem = await fixture('<d2l-input-time label="label text" default-value="startOfDay"></d2l-input-time>');
			expect(elem.value).to.equal('00:00:00');
		});

		it('should apply custom default value from keyword: endOfDay', async() => {
			const elem = await fixture('<d2l-input-time label="label text" default-value="endOfDay"></d2l-input-time>');
			expect(elem.value).to.equal('23:59:59');
		});

		it('should apply default when given value is empty', async() => {
			const elem = await fixture('<d2l-input-time label="label text" value=""></d2l-input-time>');
			expect(getInput(elem).value).to.equal('12:00 AM');
		});

		it('should correctly set given value', async() => {
			const elem = await fixture(fixtureWithValue);
			expect(getInput(elem).value).to.equal('11:22 AM');
		});

		it('should throw an error with invalid given value', async() => {
			const elem = await fixture('<d2l-input-time label="label text"></d2l-input-time>');
			expect(() => elem.value = 'potato')
				.to.throw('Invalid input: Expected format is hh:mm:ss');
		});

		it('should correctly set given value over default value', async() => {
			const elem = await fixture('<d2l-input-time label="label text" default-value="02:00:00" value="04:00:00"></d2l-input-time>');
			expect(getInput(elem).value).to.equal('4:00 AM');
		});

		it('should not save input seconds after time changes', async() => {
			//Seconds are saved when value is assigned directly, not when input by user (for EOD)
			const elem = await fixture(fixtureWithValue);
			getInput(elem).value = '11:45:15 AM';
			dispatchEvent(elem, 'change', false);
			await oneEvent(elem, 'change');
			expect(elem.value).to.equal('11:45:00');
		});

		it('should update value when dropdown changes', async() => {
			const elem = await fixture(fixtureWithValue);
			setTimeout(() => getFirstOption(elem).click());
			await oneEvent(elem, 'change');
			expect(elem.value).to.equal('00:00:00');
		});

		it('should update textbox value when dropdown changes', async() => {
			const elem = await fixture(fixtureWithValue);
			setTimeout(() => getFirstOption(elem).click());
			await oneEvent(elem, 'change');
			await elem.updateComplete;
			expect(getInput(elem).value).to.equal('12:00 AM');
		});
	});

	describe('intervals', () => {

		it('should default to half-hour intervals', async() => {
			const elem = await fixture(basicFixture);
			await aTimeout(1);
			expect(getNumberOfIntervals(elem)).to.equal(49); //24 hours x 2 30-minute intervals + EOD
		});

		it('should respect time-intervals property', async() => {
			const elem = await fixture(hourLongIntervals);
			await aTimeout(1);
			expect(getNumberOfIntervals(elem)).to.equal(25); //24 60-minute intervals + EOD
		});

		it('should not offer end-of-day option when intervals are enforced', async() => {
			const elem = await fixture(hourLongIntervalsEnforced);
			await aTimeout(1);
			expect(getNumberOfIntervals(elem)).to.equal(24);
		});

		it('should round-up to next interval when intervals are enforced', async() => {
			const elem = await fixture(hourLongIntervalsEnforced);
			getInput(elem).value = '2:01AM';
			dispatchEvent(elem, 'change', false);
			await oneEvent(elem, 'change');
			expect(elem.value).to.equal('03:00:00');
		});

		it('should round-up to next interval when intervals are enforced and value is set', async() => {
			const elem = await fixture(hourLongIntervalsEnforced);
			elem.value = '2:01:00';
			await elem.updateComplete;
			expect(elem.value).to.equal('03:00:00');
		});
	});

});
