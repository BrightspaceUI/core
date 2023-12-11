import '../input-date-range.js';
import { expect, fixture, focusElem, html, nextFrame, oneEvent, sendKeys, sendKeysElem } from '@brightspace-ui/testing';
import { reset, useFakeTimers } from 'sinon';
import { ifDefined } from 'lit/directives/if-defined.js';
import { styleMap } from 'lit/directives/style-map.js';

const create = (opts = {}) => {
	const {
		autoShiftDates,
		childLabelsHidden,
		disabled,
		endLabel,
		endOpened,
		endValue,
		inclusiveDateRange,
		label,
		labelHidden,
		maxValue,
		minValue,
		required,
		skeleton,
		startLabel,
		startOpened,
		startValue,
		wrapped
	} = {
		autoShiftDates: false,
		childLabelsHidden: false,
		disabled: false,
		endOpened: false,
		inclusiveDateRange: false,
		label: 'Dates',
		labelHidden: true,
		required: false,
		skeleton: false,
		startOpened: false,
		wrapped: false,
		...opts
	};
	const styles = {
		maxWidth: wrapped ? '300px' : undefined,
	};
	const elem = html`
		<d2l-input-date-range
			?auto-shift-dates="${autoShiftDates}"
			?child-labels-hidden="${childLabelsHidden}"
			?disabled="${disabled}"
			end-label="${ifDefined(endLabel)}"
			?end-opened="${endOpened}"
			end-value="${ifDefined(endValue)}"
			?inclusive-date-range="${inclusiveDateRange}"
			label="${label}"
			?label-hidden="${labelHidden}"
			max-value="${ifDefined(maxValue)}"
			min-value="${ifDefined(minValue)}"
			?required="${required}"
			?skeleton="${skeleton}"
			start-label="${ifDefined(startLabel)}"
			?start-opened="${startOpened}"
			start-value="${ifDefined(startValue)}"
			style="${styleMap(styles)}"></d2l-input-date-range>
	`;
	return wrapped ? html`<div>${elem}</div>` : elem;
};

const hiddenLabelsFixture = create({ endLabel: 'Finish', childLabelsHidden: true, labelHidden: false, startLabel: 'Start' });
const hiddenLabelsWrappedFixture = create({ endLabel: 'Finish', childLabelsHidden: true, labelHidden: false, startLabel: 'Start', wrapped: true });
const minMaxFixture = create({ maxValue: '2022-01-01', minValue: '2019-01-01' });
const requiredFixture = create({ labelHidden: false, required: true });

const newToday = new Date('2018-02-12T12:00Z');

describe('d2l-input-date-range', () => {

	before(() => useFakeTimers({ now: newToday.getTime(), toFake: ['Date'] }));
	after(() => reset());

	async function changeInnerInputTextDate(elem, inputSelector, date) {
		const dateElem = elem.shadowRoot.querySelector(inputSelector);
		const innerInput = dateElem.shadowRoot.querySelector('d2l-input-text');
		innerInput.value = date;
		innerInput.dispatchEvent(new Event('change', { bubbles: true, composed: false }));
	}

	[
		{ name: 'basic', template: create() },
		{ name: 'basic-focus', template: create(), focus: true },
		{ name: 'basic-wrapped', template: create({ wrapped: true }) },
		{ name: 'disabled', template: create({ disabled: true }) },
		{ name: 'invalid-start-value', template: create({ startValue: 'asdf' }) },
		{ name: 'hidden-labels', template: hiddenLabelsFixture },
		{ name: 'hidden-labels-skeleton', template: create({ endLabel: 'Finish', childLabelsHidden: true, labelHidden: false, skeleton: true, startLabel: 'Start' }) },
		{ name: 'hidden-labels-wrapped', template: hiddenLabelsWrappedFixture },
		{ name: 'hidden-labels-wrapped-skeleton', template: create({ endLabel: 'Finish', childLabelsHidden: true, labelHidden: false, skeleton: true, startLabel: 'Start', wrapped: true }) },
		{ name: 'labelled', template: create({ labelHidden: false }) },
		{ name: 'labelled-skeleton', template: create({ labelHidden: false, skeleton: true }) },
		{ name: 'label-hidden', template: create() },
		{ name: 'label-hidden-skeleton', template: create({ skeleton: true }) },
		{ name: 'required', template: requiredFixture },
		{ name: 'start-end-label', template: create({ endLabel: 'Finish', startLabel: 'A long start date label explanation' }) },
		{ name: 'start-end-value', template: create({ endValue: '2020-10-12', startValue: '2019-03-02' }) }
	].forEach(({ name, focus, template }) => {
		it(name, async() => {
			const elem = await fixture(template);
			const actualElem = elem.tagName === 'DIV' ? elem.querySelector('d2l-input-date-range') : elem;
			if (focus) {
				focusElem(actualElem);
				await oneEvent(elem, 'd2l-tooltip-show');
			}
			await expect(actualElem).to.be.golden();
		});
	});

	it('required focus then blur', async() => {
		const elem = await fixture(requiredFixture);
		await focusElem(elem);
		await sendKeys('press', 'Shift+Tab');
		await expect(elem).to.be.golden();
	});

	it('required focus then blur then fix', async() => {
		const elem = await fixture(requiredFixture);
		await focusElem(elem);
		await sendKeys('press', 'Shift+Tab');
		await changeInnerInputTextDate(elem, 'd2l-input-date.d2l-input-date-range-start', '07/06/2023');
		await expect(elem).to.be.golden();
	});

	describe('opened behavior', () => {
		it('intially start opened', async() => {
			const elem = await fixture(create({ startOpened: true }));
			await expect(elem).to.be.golden();
		});
		it('end opened', async() => {
			const elem = await fixture(create({ endOpened: true }));
			await expect(elem).to.be.golden();
		});
	});

	describe('validation', () => {

		const startDateSelector = 'd2l-input-date.d2l-input-date-range-start';
		const endDateSelector = 'd2l-input-date.d2l-input-date-range-end';

		// min = 2019-01-01, max = 2022-01-01
		const dateBeforeMin = '08/07/2016';
		const dateFurtherBeforeMin = '02/03/2015';
		const dateInRange = '06/06/2019';
		const dateLaterInRange = '07/07/2021';
		const dateAfterMax = '10/31/2025';
		const dateFurtherAfterMax = '12/31/2027';

		it('start equals end when inclusive', async() => {
			const elem = await fixture(create({ inclusiveDateRange: true }));
			await changeInnerInputTextDate(elem, startDateSelector, dateInRange);
			await changeInnerInputTextDate(elem, endDateSelector, dateInRange);
			await expect(elem).to.be.golden();
		});

		it('start changes when auto-shift-dates', async() => {
			const elem = await fixture(create({ autoShiftDates: true, endValue: '2021-12-04', startValue: '2020-12-02' }));
			await changeInnerInputTextDate(elem, startDateSelector, '12/05/2020');
			await expect(elem).to.be.golden();
		});

		describe('bad input', () => {

			let elem;
			beforeEach(async() => { elem = await fixture(minMaxFixture); });

			describe('function', () => {
				it('open', async() => {
					await changeInnerInputTextDate(elem, startDateSelector, dateLaterInRange);
					await changeInnerInputTextDate(elem, endDateSelector, dateInRange);
					await sendKeysElem(elem.shadowRoot.querySelector('d2l-input-date').shadowRoot.querySelector('d2l-input-text'), 'press', 'Enter');
					await expect(elem).to.be.golden();
				});
			});

			[
				{ name: 'start equals end', startDate: dateInRange, endDate: dateInRange },
				{ name: 'start after end', startDate: dateLaterInRange, endDate: dateInRange }
			].forEach(({ name, startDate, endDate }) => {
				describe(name, () => {

					beforeEach(async() => {
						await changeInnerInputTextDate(elem, startDateSelector, startDate);
						await changeInnerInputTextDate(elem, endDateSelector, endDate);
					});

					it('basic', async() => {
						await expect(elem).to.be.golden();
					});

					it('focus start', async() => {
						await focusElem(elem.shadowRoot.querySelector(startDateSelector));
						await nextFrame();
						await expect(elem).to.be.golden();
					});

					it('focus end', async() => {
						await focusElem(elem.shadowRoot.querySelector(endDateSelector));
						await nextFrame();
						await expect(elem).to.be.golden();
					});

				});
			});
		});

		describe('outside range', () => {

			[
				{ name: 'start before min', startDate: dateBeforeMin, endDate: dateInRange },
				{ name: 'end after max', startDate: dateInRange, endDate: dateAfterMax }
			].forEach(({ name, startDate, endDate }) => {
				describe(name, () => {

					let elem;
					beforeEach(async() => {
						elem = await fixture(minMaxFixture);
						await changeInnerInputTextDate(elem, startDateSelector, '');
						await changeInnerInputTextDate(elem, endDateSelector, '');
						await changeInnerInputTextDate(elem, startDateSelector, startDate);
						await changeInnerInputTextDate(elem, endDateSelector, endDate);
						await elem.updateComplete;
						await elem.validate();
						await elem.updateComplete;
					});

					it('basic', async() => {
						await expect(elem).to.be.golden();
					});

					it('focus start', async() => {
						focusElem(elem.shadowRoot.querySelector(startDateSelector));
						await oneEvent(elem, 'd2l-tooltip-show');
						await expect(elem).to.be.golden();
					});

					it('focus end', async() => {
						focusElem(elem.shadowRoot.querySelector(endDateSelector));
						await oneEvent(elem, 'd2l-tooltip-show');
						await expect(elem).to.be.golden();
					});
				});
			});
		});

		describe('bad input and outside range', () => {

			[
				{
					name: 'start before min and end before start',
					startDate: dateBeforeMin,
					endDate: dateFurtherBeforeMin,
					changeStartDateFirst: true
				}, {
					name: 'start valid and end before start and before min',
					startDate: dateInRange,
					endDate: dateBeforeMin,
					changeStartDateFirst: true
				}, {
					name: 'end after max and start after end',
					startDate: dateFurtherAfterMax,
					endDate: dateAfterMax,
					changeStartDateFirst: false
				}, {
					name: 'end valid and start after end and after max',
					startDate: dateAfterMax,
					endDate: dateInRange,
					changeStartDateFirst: false
				}
			].forEach(({ name, startDate, endDate, changeStartDateFirst }) => {
				describe(name, () => {

					let elem;
					beforeEach(async() => {
						elem = await fixture(minMaxFixture);
						await changeInnerInputTextDate(elem, startDateSelector, '');
						await changeInnerInputTextDate(elem, endDateSelector, '');
						await changeInnerInputTextDate(elem, changeStartDateFirst ? startDateSelector : endDateSelector, changeStartDateFirst ? startDate : endDate);
						await changeInnerInputTextDate(elem, changeStartDateFirst ? endDateSelector : startDateSelector, changeStartDateFirst ? endDate : startDate);
						await elem.updateComplete;
						await elem.validate();
						await elem.updateComplete;
					});

					it('focus start', async() => {
						focusElem(elem.shadowRoot.querySelector(startDateSelector));
						await oneEvent(elem, 'd2l-tooltip-show');
						await expect(elem).to.be.golden();
					});

					it('focus end', async() => {
						focusElem(elem.shadowRoot.querySelector(endDateSelector));
						await oneEvent(elem, 'd2l-tooltip-show');
						await expect(elem).to.be.golden();
					});
				});
			});
		});

	});

	describe('width change', () => {
		it('resizes correctly when width increased', async() => {
			const wrapper = await fixture(hiddenLabelsWrappedFixture);
			const elem = wrapper.querySelector('d2l-input-date-range');
			elem.style.maxWidth = '800px';
			wrapper.style.width = '800px';
			await nextFrame();
			await expect(elem).to.be.golden();
		});

		it('resizes correctly when width decreased', async() => {
			const elem = await fixture(hiddenLabelsFixture);
			elem.style.maxWidth = '250px';
			await nextFrame();
			await expect(elem).to.be.golden();
		});
	});

});
