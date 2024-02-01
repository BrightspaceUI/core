import '../input-date-time-range.js';
import { defineCE, expect, fixture, focusElem, html, nextFrame, oneEvent, sendKeysElem } from '@brightspace-ui/testing';
import { LitElement, nothing } from 'lit';
import { reset, useFakeTimers } from 'sinon';
import { ifDefined } from 'lit/directives/if-defined.js';
import { inlineHelpFixtures } from './input-shared-content.js';
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
		localized,
		maxValue,
		maxWidth,
		minValue,
		required,
		slottedContent,
		skeleton,
		startLabel,
		startOpened,
		startValue,
		width
	} = {
		autoShiftDates: false,
		childLabelsHidden: false,
		disabled: false,
		endOpened: false,
		inclusiveDateRange: false,
		label: 'Dates',
		labelHidden: true,
		localized: false,
		required: false,
		skeleton: false,
		slottedContent: false,
		startOpened: false,
		width: 400,
		...opts
	};
	const styles = {
		maxWidth: maxWidth ? `${maxWidth}px` : undefined
	};
	const slotted = slottedContent ? html`<div slot="start">First slot content</div><div slot="end">Second slot content</div>` : nothing;
	const elem = html`
		<d2l-input-date-time-range
			?auto-shift-dates="${autoShiftDates}"
			?child-labels-hidden="${childLabelsHidden}"
			class="vdiff-include"
			?disabled="${disabled}"
			end-label="${ifDefined(endLabel)}"
			?end-opened="${endOpened}"
			end-value="${ifDefined(endValue)}"
			?inclusive-date-range="${inclusiveDateRange}"
			label="${label}"
			?label-hidden="${labelHidden}"
			?localized="${localized}"
			max-value="${ifDefined(maxValue)}"
			min-value="${ifDefined(minValue)}"
			?required="${required}"
			?skeleton="${skeleton}"
			start-label="${ifDefined(startLabel)}"
			?start-opened="${startOpened}"
			start-value="${ifDefined(startValue)}"
			style="${styleMap(styles)}">
			${slotted}
		</d2l-input-date-time-range>
	`;
	return html`<div style="width: ${width}px">${elem}</div>`;
};

const hiddenLabelsFixture = create({ childLabelsHidden: true, endLabel: 'Finish', labelHidden: false, startLabel: 'Start', maxWidth: 300 });
const localizedFixture = create({ autoShiftDates: true, endValue: '2021-12-04T10:30:00.000Z', localized: true, startValue: '2020-12-02T06:00:00.000Z' });
const minMaxFixture = create({ labelHidden: false, maxValue: '2018-09-30T12:30:00Z', minValue: '2016-03-27T12:30:00Z' });
const wideHiddenLabelsValuesFixture = create({ childLabelsHidden: true, endLabel: 'Finish', endValue: '2021-12-04T10:30:00.000Z', labelHidden: false, startLabel: 'Start', startValue: '2020-12-02T06:00:00.000Z', width: 800 });

const newToday = new Date('2018-02-12T12:00Z');

const tag = defineCE(
	class extends LitElement {
		render() {
			return html`<d2l-input-date-time-range class="vdiff-target" child-labels-hidden label="Custom Range"></d2l-input-date-time-range>`;
		}
	}
);

describe('d2l-input-date-time-range', () => {

	before(() => useFakeTimers({ now: newToday.getTime(), toFake: ['Date'] }));
	after(() => reset());

	[
		{ name: 'basic', template: create() },
		{ name: 'basic-focus', template: create(), focus: true },
		{ name: 'disabled', template: create({ disabled: true }) },
		{ name: 'invalid-start-value', template: create({ startValue: 'asdf' }) },
		{ name: 'hidden-labels', template: hiddenLabelsFixture },
		{ name: 'hidden-labels-values', template: create({ childLabelsHidden: true, endLabel: 'Finish', endValue: '2021-12-04T10:30:00.000Z', labelHidden: false, startLabel: 'Start', startValue: '2020-12-02T06:00:00.000Z' }) },
		{ name: 'hidden-labels-values-skeleton', template: create({ childLabelsHidden: true, endLabel: 'Finish', endValue: '2021-12-04T10:30:00.000Z', labelHidden: false, skeleton: true, startLabel: 'Start', startValue: '2020-12-02T06:00:00.000Z' }) },
		{ name: 'labelled', template: create({ labelHidden: false }) },
		{ name: 'labelled-skeleton', template: create({ labelHidden: false, skeleton: true }) },
		{ name: 'label-hidden', template: create() },
		{ name: 'label-hidden-skeleton', template: create({ skeleton: true }) },
		{ name: 'localized', template: localizedFixture },
		{ name: 'required', template: create({ labelHidden: false, required: true }) },
		{ name: 'slotted-content', template: create({ slottedContent: true }) },
		{ name: 'start-end-label', template: create({ endLabel: 'Finish', startLabel: 'A long start date label explanation', maxWidth: 300 }) },
		{ name: 'start-end-value', template: create({ endValue: '2021-01-12T07:30:00.000Z', startValue: '2020-12-02T15:00:00.000Z' }) },
		{ name: 'start-value', template: create({ startValue: '2020-12-02T15:00:00.000Z' }) },
		{ name: 'wide-basic', template: create({ width: 800 }) },
		{ name: 'wide-hidden-labels-values', template: wideHiddenLabelsValuesFixture },
		{ name: 'wide-hidden-labels-values-skeleton', template: create({ childLabelsHidden: true, endLabel: 'Finish', endValue: '2021-12-04T10:30:00.000Z', labelHidden: false, skeleton: true, startLabel: 'Start', startValue: '2020-12-02T06:00:00.000Z', width: 800 }) },
		{ name: 'wide-start-end-value', template: create({ endValue: '2021-01-12T08:30:00.000Z', startValue: '2020-12-02T15:00:00.000Z', width: 800 }) }
	].forEach(({ name, focus, template }) => {
		it(name, async() => {
			const elem = await fixture(template);
			const actualElem = elem.querySelector('d2l-input-date-time-range');
			if (focus) {
				focusElem(actualElem);
				await oneEvent(elem, 'd2l-tooltip-show');
			}
			await expect(actualElem).to.be.golden();
		});
	});

	[
		{
			name: 'inline-help',
			template: new inlineHelpFixtures().dateTimeRange()
		},
		{
			name: 'inline-help-multiline',
			template: new inlineHelpFixtures({ multiline: true }).dateTimeRange()
		},
		{
			name: 'inline-help-skeleton',
			template: new inlineHelpFixtures({ skeleton: true }).dateTimeRange()
		},
		{
			name: 'inline-help-skeleton-multiline',
			template: new inlineHelpFixtures({ multiline: true, skeleton: true }).dateTimeRange()
		},
		{
			name: 'inline-help-disabled',
			template: new inlineHelpFixtures({ disabled: true }).dateTimeRange()
		}
	].forEach(({ name, template }) => {
		it(name, async() => {
			const elem = await fixture(template);
			await expect(elem).to.be.golden();
		});
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

		const startDateSelector = 'd2l-input-date-time.d2l-input-date-time-range-start';
		const endDateSelector = 'd2l-input-date-time.d2l-input-date-time-range-end';

		// min-value="2016-03-27T12:30:00Z" max-value="2018-09-30T12:30:00Z"
		const dateBeforeMin = '2016-01-07T15:00:00Z';
		const dateFurtherBeforeMin = '2015-02-03T03:00:00Z';
		const dateInRange = '2018-06-06T18:00:00Z';
		const dateLaterInRange = '2018-07-07T23:45:00Z';
		const dateAfterMax = '2025-10-31T15:00:00Z';
		const dateFurtherAfterMax = '2027-12-31T15:00:00Z';

		async function changeInnerInputTextDate(elem, inputSelector, date, waitForTime) {
			const dateElem = elem.querySelector('d2l-input-date-time-range').shadowRoot.querySelector(inputSelector);
			const innerInput = dateElem.shadowRoot.querySelector('d2l-input-date');
			innerInput.value = date;
			innerInput.dispatchEvent(new Event('change', { bubbles: true, composed: false }));
			if (waitForTime) {
				await elem.updateComplete;
				await oneEvent(dateElem.shadowRoot.querySelector('d2l-input-time'), 'd2l-input-time-hidden-content-width-change');
			}
		}

		async function changeInnerInputDateTime(elem, inputSelector, date, waitForTime) {
			const dateElem = elem.querySelector('d2l-input-date-time-range').shadowRoot.querySelector(inputSelector);
			dateElem.value = date;
			dateElem.dispatchEvent(new Event('change', { bubbles: true, composed: false }));
			if (waitForTime) {
				await elem.updateComplete;
				await oneEvent(dateElem.shadowRoot.querySelector('d2l-input-time'), 'd2l-input-time-hidden-content-width-change');
			}
		}

		it('start equals end when inclusive', async() => {
			const elem = await fixture(create({ inclusiveDateRange: true }));
			await changeInnerInputTextDate(elem, startDateSelector, dateInRange);
			await changeInnerInputTextDate(elem, endDateSelector, dateInRange, true);
			await expect(elem).to.be.golden();
		});

		describe('auto-shift-dates', () => {
			[true, false].forEach(localized => {
				// start-value: 2020-12-02T06:00:00.000Z
				// end-value: 2021-12-04T10:30:00.000Z
				describe(localized ? 'localized' : 'not localized', () => {
					it('change start date', async() => {
						const elem = await fixture(create({ autoShiftDates: true, endValue: '2021-12-04T10:30:00.000Z', localized: localized, startValue: '2020-12-02T06:00:00.000Z' }));
						await changeInnerInputDateTime(elem, startDateSelector, '2020-12-05T06:00:00.000Z');
						await expect(elem.querySelector('d2l-input-date-time-range')).to.be.golden();
					});

					it('change start time', async() => {
						const elem = await fixture(create({ autoShiftDates: true, endValue: '2021-12-07T10:30:00.000Z', localized: localized, startValue: '2020-12-05T06:00:00.000Z' }));
						await changeInnerInputDateTime(elem, endDateSelector, '2020-12-05T10:30:00.000Z');
						await changeInnerInputDateTime(elem, startDateSelector, '2020-12-05T15:00:00.000Z');
						await expect(elem.querySelector('d2l-input-date-time-range')).to.be.golden();
					});

					it('change start date when dates same', async() => {
						const elem = await fixture(create({ autoShiftDates: true, endValue: '2020-12-05T19:30:00.000Z', localized: localized, startValue: '2020-12-05T15:00:00.000Z' }));
						await changeInnerInputDateTime(elem, startDateSelector, '2020-12-13T15:00:00.000Z');
						await expect(elem.querySelector('d2l-input-date-time-range')).to.be.golden();
					});

					it('change start time to cause max value to be reached', async() => {
						const elem = await fixture(create({ autoShiftDates: true, endValue: '2020-12-13T19:30:00.000Z', localized: localized, startValue: '2020-12-13T15:00:00.000Z' }));
						const actualElem = elem.querySelector('d2l-input-date-time-range');
						const dateElem = actualElem.shadowRoot.querySelector(startDateSelector);
						const innerInput = dateElem.shadowRoot.querySelector('d2l-input-time');
						innerInput.value = '22:00:00';
						innerInput.dispatchEvent(new Event('change', { bubbles: true, composed: false }));
						await expect(actualElem).to.be.golden();
					});
				});
			});
		});

		describe('bad input', () => {

			describe('function', () => {

				it('open', async() => {
					const elem = await fixture(minMaxFixture);
					const actualElem = elem.querySelector('d2l-input-date-time-range');
					actualElem.shadowRoot.querySelector('d2l-input-date-time').shadowRoot.querySelector('d2l-input-date')._handleFirstDropdownOpen();
					await changeInnerInputTextDate(elem, startDateSelector, dateLaterInRange);
					await changeInnerInputTextDate(elem, endDateSelector, dateInRange);
					const input = actualElem.shadowRoot.querySelector('d2l-input-date-time');
					const input2 = input.shadowRoot.querySelector('d2l-input-date');
					const input3 = input2.shadowRoot.querySelector('d2l-input-text');
					await sendKeysElem(input3, 'press', 'Enter');
					await expect(actualElem).to.be.golden();
				});
			});

			[
				{ name: 'start equals end', startDate: dateInRange, endDate: dateInRange },
				{ name: 'start after end', startDate: dateLaterInRange, endDate: dateInRange }
			].forEach(({ name, startDate, endDate }) => {
				describe(name, () => {

					let elem, actualElem;
					beforeEach(async() => {
						elem = await fixture(minMaxFixture);
						actualElem = elem.querySelector('d2l-input-date-time-range');
						await changeInnerInputDateTime(elem, startDateSelector, startDate);
						await changeInnerInputDateTime(elem, endDateSelector, endDate, true);
					});

					it('basic', async() => {
						await expect(elem).to.be.golden();
					});

					it('focus start', async() => {
						focusElem(actualElem.shadowRoot.querySelector(startDateSelector));
						await oneEvent(actualElem, 'd2l-tooltip-show');
						await expect(elem).to.be.golden();
					});

					it('focus end', async() => {
						focusElem(actualElem.shadowRoot.querySelector(endDateSelector));
						await oneEvent(actualElem, 'd2l-tooltip-show');
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

					let elem, actualElem;
					beforeEach(async() => {
						elem = await fixture(minMaxFixture);
						actualElem = elem.querySelector('d2l-input-date-time-range');
						await changeInnerInputTextDate(elem, startDateSelector, startDate, true);
						await changeInnerInputTextDate(elem, endDateSelector, endDate, true);
					});

					it('basic', async() => {
						await expect(elem).to.be.golden();
					});

					it('focus start', async() => {
						focusElem(actualElem.shadowRoot.querySelector(startDateSelector));
						await oneEvent(actualElem, 'd2l-tooltip-show');
						await expect(elem).to.be.golden();
					});

					it('focus end', async() => {
						focusElem(actualElem.shadowRoot.querySelector(endDateSelector));
						await oneEvent(actualElem, 'd2l-tooltip-show');
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

					let elem, actualElem;
					beforeEach(async() => {
						elem = await fixture(minMaxFixture);
						actualElem = elem.querySelector('d2l-input-date-time-range');
						await changeInnerInputTextDate(elem, changeStartDateFirst ? startDateSelector : endDateSelector, changeStartDateFirst ? startDate : endDate, true);
						await changeInnerInputTextDate(elem, changeStartDateFirst ? endDateSelector : startDateSelector, changeStartDateFirst ? endDate : startDate, true);
					});

					it('focus start', async() => {
						focusElem(actualElem.shadowRoot.querySelector(startDateSelector));
						await oneEvent(actualElem, 'd2l-tooltip-show');
						await expect(actualElem).to.be.golden();
					});

					it('focus end', async() => {
						focusElem(actualElem.shadowRoot.querySelector(endDateSelector));
						await oneEvent(actualElem, 'd2l-tooltip-show');
						await expect(actualElem).to.be.golden();
					});
				});
			});
		});

	});

	describe('width change', () => {
		it('resizes correctly when width increased', async() => {
			const wrapper = await fixture(hiddenLabelsFixture);
			const elem = wrapper.querySelector('d2l-input-date-time-range');
			elem.style.maxWidth = '800px';
			wrapper.style.width = '800px';
			await nextFrame();
			await expect(elem).to.be.golden();
		});

		it('resizes correctly when width decreased', async() => {
			const wrapper = await fixture(wideHiddenLabelsValuesFixture);
			const elem = wrapper.querySelector('d2l-input-date-time-range');
			wrapper.style.width = '350px';
			await nextFrame();
			await expect(elem).to.be.golden();
		});

		it('resizes correctly when width decreased further', async() => {
			const wrapper = await fixture(wideHiddenLabelsValuesFixture);
			const elem = wrapper.querySelector('d2l-input-date-time-range');
			wrapper.style.width = '250px';
			await nextFrame();
			await expect(elem).to.be.golden();
		});
	});

	describe('within custom elem', () => {
		it('is correct at default width', async() => {
			const elem = await fixture(`<${tag}></${tag}>`);
			await expect(elem).to.be.golden();
		});
		it('is correct at small width', async() => {
			const elem = await fixture(`<${tag}></${tag}>`, { viewport: { width: 350 } });
			await expect(elem).to.be.golden();
		});
	});

});
