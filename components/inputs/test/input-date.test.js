import { aTimeout, expect, fixture, oneEvent, runConstructor, waitUntil } from '@brightspace-ui/testing';
import { formatISODateInUserCalDescriptor } from '../input-date.js';
import { getDocumentLocaleSettings } from '@brightspace-ui/intl/lib/common.js';
import sinon from 'sinon';

const basicFixture = '<d2l-input-date has-now label="label text"></d2l-input-date>';

function dispatchEvent(elem, eventType, composed) {
	const e = new Event(
		eventType,
		{ bubbles: true, composed: composed }
	);
	elem.dispatchEvent(e);
}

function getChildElem(elem, selector) {
	return elem.shadowRoot.querySelector(selector);
}

describe('d2l-input-date', () => {
	const documentLocaleSettings = getDocumentLocaleSettings();
	documentLocaleSettings.timezone.identifier = 'America/Toronto';

	describe('accessibility', () => {

		it('should set description when empty-text', async() => {
			const elem = await fixture('<d2l-input-date empty-text="text description" label="label text"></d2l-input-date>');
			const input = getChildElem(elem, 'd2l-input-text');
			expect(input.getAttribute('description')).to.equal('text description');
		});

		it('should not set description when no empty-text', async() => {
			const elem = await fixture(basicFixture);
			const input = getChildElem(elem, 'd2l-input-text');
			expect(input.hasAttribute('description')).to.be.false;
		});
	});

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-input-date');
		});

	});

	describe('open and close behaviour', () => {
		describe('interacting with opened', () => {
			let dropdown, dropdownContent, elem;

			beforeEach(async() => {
				elem = await fixture(basicFixture);
				elem.opened = true;
				await elem.updateComplete;
				dropdown = getChildElem(elem, 'd2l-dropdown');
				dropdownContent = getChildElem(elem, 'd2l-dropdown-content');
				await oneEvent(dropdown, 'd2l-dropdown-open');
			});

			it('should open dropdown when true', async() => {
				await dropdownContent.updateComplete;
				expect(dropdownContent.opened).to.be.true;
			});

			it('should close dropdown when false', async() => {
				expect(dropdownContent.opened).to.be.true;
				elem.opened = false;
				await elem.updateComplete;
				await oneEvent(dropdown, 'd2l-dropdown-close');
				expect(dropdownContent.opened).to.be.false;
			});
		});

		describe('interacting with dropdown', () => {
			let dropdown, dropdownOpener, elem, eventObj;

			beforeEach(async() => {
				elem = await fixture(basicFixture);

				dropdown = getChildElem(elem, 'd2l-dropdown');
				dropdownOpener = getChildElem(elem, '.d2l-dropdown-opener');

				eventObj = new Event(
					'mouseup',
					{ bubbles: true, composed: true }
				);

				dropdownOpener.dispatchEvent(eventObj);
				await oneEvent(dropdown, 'd2l-dropdown-open');
			});

			it('should set opened to true when dropdown open', async() => {
				expect(elem.opened).to.be.true;
			});

			it('should set opened to false when dropdown closed', async() => {
				dropdownOpener.dispatchEvent(eventObj);
				await oneEvent(dropdown, 'd2l-dropdown-close');
				expect(elem.opened).to.be.false;
			});
		});

		it('should open on enter', async() => {
			const elem = await fixture(basicFixture);

			const dropdown = getChildElem(elem, 'd2l-dropdown');
			const dropdownOpener = getChildElem(elem, '.d2l-dropdown-opener');

			const eventObj = document.createEvent('Events');
			eventObj.initEvent('keydown', true, true);
			eventObj.keyCode = 13;
			dropdownOpener.dispatchEvent(eventObj);
			await oneEvent(dropdown, 'd2l-dropdown-open');

			expect(elem.opened).to.be.true;
		});
	});

	describe('utility functions', () => {
		describe('formatISODateInUserCalDescriptor', () => {
			it('should return correct date when input is valid', () => {
				expect(formatISODateInUserCalDescriptor('2019-01-30')).to.equal('1/30/2019');
			});
		});
	});

	describe('value', () => {
		const dateInput = '2/8/2019';

		it('should fire "change" event when input value changes', async() => {
			const elem = await fixture(basicFixture);
			const inputElem = getChildElem(elem, 'd2l-input-text');
			inputElem.value = dateInput;
			dispatchEvent(inputElem, 'change', false);
			await oneEvent(elem, 'change');
		});

		it('should fire "change" event when calendar value selected', async() => {
			const elem = await fixture(basicFixture);
			elem._dropdownFirstOpened = true;
			await elem.updateComplete;
			const calendarElem = getChildElem(elem, 'd2l-calendar');
			calendarElem.selectedValue = '2018-03-24';
			setTimeout(() => dispatchEvent(calendarElem, 'd2l-calendar-selected', false));
			await oneEvent(elem, 'change');
			expect(elem.value).to.equal('2018-03-24');
		});

		it('should fire "change" event when "Today" is clicked', async() => {
			const newToday = new Date('2018-02-12T20:00:00Z');
			const clock = sinon.useFakeTimers({ now: newToday.getTime(), toFake: ['Date'] });

			const elem = await fixture(basicFixture);
			elem._dropdownFirstOpened = true;
			await elem.updateComplete;
			const button = getChildElem(elem, 'd2l-button-subtle[text="Today"]');
			setTimeout(() => button.click());
			await oneEvent(elem, 'change');
			expect(elem.value).to.equal('2018-02-12');

			clock.restore();
		});

		it('should fire "change" event when "Now" is clicked multiple times', async() => {
			const newToday = new Date('2018-02-12T20:00:00Z');
			const clock = sinon.useFakeTimers({ now: newToday.getTime(), toFake: ['Date'] });

			const elem = await fixture(basicFixture);
			elem._dropdownFirstOpened = true;
			await elem.updateComplete;
			const button = getChildElem(elem, 'd2l-button-subtle[text="Now"]');
			setTimeout(() => button.click());
			await oneEvent(elem, 'change');
			expect(elem.value).to.equal('2018-02-12');

			// change event should be fired even though the date did not change
			setTimeout(() => button.click());
			await oneEvent(elem, 'change');
			expect(elem.value).to.equal('2018-02-12');

			clock.restore();
		});

		it('should fire "change" event when "Clear" is clicked', async() => {
			const elem = await fixture('<d2l-input-date label="label text" value="2019-02-01"></d2l-input-date>');
			elem._dropdownFirstOpened = true;
			await elem.updateComplete;
			const button = getChildElem(elem, 'd2l-button-subtle[text="Clear"]');
			setTimeout(() => button.click());
			await oneEvent(elem, 'change');
			expect(elem.value).to.equal('');
		});

		it('should fire "change" event when input-text value is changed to empty', async() => {
			const elem = await fixture('<d2l-input-date label="label text" value="2019-02-01"></d2l-input-date>');
			const inputElem = getChildElem(elem, 'd2l-input-text');
			inputElem.value = '';
			setTimeout(() => dispatchEvent(inputElem, 'change', false));
			await oneEvent(elem, 'change');
			expect(elem.value).to.equal('');
		});

		it('should not fire "change" event when input value is invalid', async() => {
			const elem = await fixture(basicFixture);
			elem._dropdownFirstOpened = true;
			await elem.updateComplete;
			const inputElem = getChildElem(elem, 'd2l-input-text');
			const calendarElem = getChildElem(elem, 'd2l-calendar');
			await waitUntil(() => calendarElem._today, 'Today was never set');
			let fired = false;
			elem.addEventListener('change', () => {
				fired = true;
			});
			inputElem.value = 'invalid input text';
			dispatchEvent(inputElem, 'change', false);
			await aTimeout(1);
			expect(fired).to.be.false;
		});

		it('should not fire "change" event when input value does not change', async() => {
			const elem = await fixture(basicFixture);
			elem.value = '2019-01-01';
			const inputElem = getChildElem(elem, 'd2l-input-text');
			let fired = false;
			elem.addEventListener('change', () => {
				fired = true;
			});
			inputElem.value = '01/01/2019';
			dispatchEvent(inputElem, 'change', false);
			await aTimeout(1);
			expect(fired).to.be.false;
		});

		it('should change "value" property when input value changes', async() => {
			const elem = await fixture(basicFixture);
			const inputElem = getChildElem(elem, 'd2l-input-text');
			inputElem.value = dateInput;
			dispatchEvent(inputElem, 'change', false);
			await oneEvent(elem, 'change');
			expect(elem.value).to.equal('2019-02-08');
		});

		it('should default to empty', async() => {
			const elem = await fixture(basicFixture);
			expect(elem.value).to.equal('');
		});

		it('should change value if typed date before minValue', async() => {
			const elem = await fixture('<d2l-input-date min-value="2020-01-02" value="2020-10-10" label="Date"></d2l-input-date>');
			const inputElem = getChildElem(elem, 'd2l-input-text');
			inputElem.value = '12/31/2019';
			setTimeout(() => dispatchEvent(inputElem, 'change', false));
			setTimeout(() => dispatchEvent(inputElem, 'blur', true));
			await oneEvent(elem, 'change');
			await oneEvent(elem, 'blur');
			await oneEvent(elem, 'invalid-change');
			expect(elem.value).to.equal('2019-12-31');
			expect(elem.invalid).to.be.true;
			expect(elem.validationError).to.equal('Date must be after Jan 2, 2020');
		});

		it('should change value if typed date after maxValue', async() => {
			const elem = await fixture('<d2l-input-date max-value="2020-12-02" value="2020-10-10" label="Date"></d2l-input-date>');
			const inputElem = getChildElem(elem, 'd2l-input-text');
			inputElem.value = '12/31/2021';
			setTimeout(() => dispatchEvent(inputElem, 'change', false));
			setTimeout(() => dispatchEvent(inputElem, 'blur', true));
			await oneEvent(elem, 'change');
			await oneEvent(elem, 'blur');
			await oneEvent(elem, 'invalid-change');
			expect(elem.value).to.equal('2021-12-31');
			expect(elem.invalid).to.be.true;
			expect(elem.validationError).to.equal('Date must be before Dec 2, 2020');
		});

		it('should change value if typed date between min and max values', async() => {
			const elem = await fixture('<d2l-input-date min-value="2019-01-01" max-value="2020-12-02" label="Date"></d2l-input-date>');
			const inputElem = getChildElem(elem, 'd2l-input-text');
			inputElem.value = dateInput;
			dispatchEvent(inputElem, 'change', false);
			await oneEvent(elem, 'change');
			await elem.updateComplete;
			expect(elem.value).to.equal('2019-02-08');
			expect(elem.invalid).to.be.false;
			expect(elem.validationError).to.be.null;
		});

		it('should change value to empty string if empty typed date', async() => {
			const elem = await fixture('<d2l-input-date min-value="2019-01-01" max-value="2020-12-02" label="Date" value="2019-10-01"></d2l-input-date>');
			const inputElem = getChildElem(elem, 'd2l-input-text');
			inputElem.value = '';
			dispatchEvent(inputElem, 'change', false);
			await elem.updateComplete;
			expect(elem.value).to.equal('');
			expect(elem.invalid).to.be.false;
			expect(elem.validationError).to.be.null;
		});

		describe('required', () => {

			it('should fire "change" event when input value changes', async() => {
				const elem = await fixture('<d2l-input-date label="Date" required></d2l-input-date>');
				const inputElem = getChildElem(elem, 'd2l-input-text');
				inputElem.value = '11/8/2011';
				dispatchEvent(inputElem, 'change', false);
				await oneEvent(elem, 'change');
				expect(elem.value).to.equal('2011-11-08');
			});

			it('should change value if typed date before minValue when required', async() => {
				const elem = await fixture('<d2l-input-date min-value="2020-01-02" label="Date" required></d2l-input-date>');
				const inputElem = getChildElem(elem, 'd2l-input-text');
				inputElem.value = '12/31/2019';
				setTimeout(() => dispatchEvent(inputElem, 'change', false));
				setTimeout(() => dispatchEvent(inputElem, 'blur', true));
				await oneEvent(elem, 'change');
				await oneEvent(elem, 'blur');
				await oneEvent(elem, 'invalid-change');
				expect(elem.value).to.equal('2019-12-31');
				expect(elem.invalid).to.be.true;
				expect(elem.validationError).to.equal('Date must be after Jan 2, 2020');
			});

			it('should not fire "change" event when input value removed', async() => {
				const elem = await fixture('<d2l-input-date label="Date" required value="2020-12-02"></d2l-input-date>');
				const inputElem = getChildElem(elem, 'd2l-input-text');
				let fired = false;
				elem.addEventListener('change', () => {
					fired = true;
				});
				inputElem.value = '';
				dispatchEvent(inputElem, 'change', false);
				await aTimeout(1);
				expect(fired).to.be.false;
				expect(elem.value).to.equal('2020-12-02');
			});
		});

	});

});
