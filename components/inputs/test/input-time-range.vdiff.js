import '../input-time-range.js';
import { defineCE, expect, fixture, focusElem, html, nextFrame, oneEvent, sendKeys, sendKeysElem } from '@brightspace-ui/testing';
import { reset, useFakeTimers } from 'sinon';
import { ifDefined } from 'lit/directives/if-defined.js';
import { LitElement } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import { inlineHelpFixtures } from './input-shared-content.js';

const create = (opts = {}) => {
	const {
		autoShiftTimes,
		childLabelsHidden,
		disabled,
		endLabel,
		endValue,
		inclusiveTimeRange,
		label,
		labelHidden,
		required,
		skeleton,
		startLabel,
		startOpened,
		startValue,
		timeInterval,
		wrapped
	} = {
		autoShiftTimes: false,
		childLabelsHidden: false,
		disabled: false,
		inclusiveTimeRange: false,
		label: 'Times',
		labelHidden: true,
		required: false,
		skeleton: false,
		startOpened: false,
		wrapped: false,
		...opts
	};
	const styles = {
		maxWidth: wrapped ? '240px' : undefined,
	};
	const elem = html`
		<d2l-input-time-range
			?auto-shift-times="${autoShiftTimes}"
			?child-labels-hidden="${childLabelsHidden}"
			?disabled="${disabled}"
			end-label="${ifDefined(endLabel)}"
			end-value="${ifDefined(endValue)}"
			?inclusive-time-range="${inclusiveTimeRange}"
			label="${ifDefined(label)}"
			?label-hidden="${labelHidden}"
			?required="${required}"
			?skeleton="${skeleton}"
			start-label="${ifDefined(startLabel)}"
			?start-opened="${startOpened}"
			start-value="${ifDefined(startValue)}"
			style="${styleMap(styles)}"
			time-interval="${ifDefined(timeInterval)}"></d2l-input-time-range>
	`;
	return wrapped ? html`<div>${elem}</div>` : elem;
};
const createHiddenLabels = (opts = {}) => {
	const { skeleton, wrapped } = { skeleton: false, wrapped: false, ...opts };
	return create({
		childLabelsHidden: true,
		endLabel: 'Finish',
		label: `Times${wrapped ? ' (wrapped)' : ''}`,
		labelHidden: false,
		skeleton,
		startLabel: 'Start',
		wrapped
	});
};

const newToday = new Date('2018-07-12T09:33Z');
const viewport = { width: 476, height: 2300 };

const tag = defineCE(
	class extends LitElement {
		render() {
			return html`<d2l-input-time-range class="vdiff-target" child-labels-hidden label="Custom Range"></d2l-input-time-range>`;
		}
	}
);

describe('d2l-input-time-range', () => {

	before(() => useFakeTimers({ now: newToday.getTime(), toFake: ['Date'] }));
	after(() => reset());

	[
		{ name: 'basic', template: create() },
		{ name: 'basic-focus', template: create(), focus: true },
		{ name: 'basic-wrapped', template: create({ wrapped: true }) },
		{ name: 'disabled', template: create({ disabled: true }) },
		{ name: 'end-value', template: create({ endValue: '18:30:00' }) },
		{ name: 'hidden-labels', template: createHiddenLabels() },
		{ name: 'hidden-labels-skeleton', template: createHiddenLabels({ skeleton: true }) },
		{ name: 'hidden-labels-wrapped', template: createHiddenLabels({ wrapped: true }) },
		{ name: 'hidden-labels-wrapped-skeleton', template: createHiddenLabels({ skeleton: true, wrapped: true }) },
		{ name: 'invalid-end-value', template: create({ endValue: 'asdf' }) },
		{ name: 'labelled', template: create({ labelHidden: false }) },
		{ name: 'labelled-skeleton', template: create({ labelHidden: false, skeleton: true }) },
		{ name: 'label-hidden', template: create() },
		{ name: 'label-hidden-skeleton', template: create({ skeleton: true }) },
		{ name: 'required', template: create({ label: 'Time Range', labelHidden: false, required: true }) },
		{ name: 'required-skeleton', template: create({ label: 'Time Range', labelHidden: false, required: true, skeleton: true }) },
		{ name: 'start-end-label', template: create({ endLabel: 'Finish', startLabel: 'A long start time label explanation' }) },
		{ name: 'start-end-value', template: create({ endValue: '12:22:00', startValue: '03:30:00' }) },
		{ name: 'start-value', template: create({ startValue: '13:30:00' }) },
		{ name: 'time-interval', template: create({ timeInterval: 'ten' }) },
		{ name: 'inline-help', template: inlineHelpFixtures.timeRange.normal },
		{ name: 'inline-help-multiline', template: inlineHelpFixtures.timeRange.multiline },
	].forEach(({ name, focus, template }) => {
		it(name, async() => {
			const elem = await fixture(template, { viewport });
			const actualElem = elem.tagName === 'DIV' ? elem.querySelector('d2l-input-time-range') : elem;
			if (focus) await focusElem(actualElem);
			await expect(actualElem).to.be.golden();
		});
	});

	describe('validation', () => {

		const startTimeSelector = 'd2l-input-time.d2l-input-time-range-start';
		const endTimeSelector = 'd2l-input-time.d2l-input-time-range-end';

		const time = '13:00:00';
		const laterTime = '15:45:30';

		async function changeInnerInputTextDate(elem, inputSelector, date) {
			const input = elem.shadowRoot.querySelector(inputSelector).shadowRoot.querySelector('input');
			input.value = date;
			input.dispatchEvent(new Event('change', { bubbles: true, composed: false }));
			await elem.updateComplete;
		}

		it('start equals end when inclusive', async() => {
			const elem = await fixture(create({ inclusiveTimeRange: true }), { viewport });
			await changeInnerInputTextDate(elem, startTimeSelector, time);
			await changeInnerInputTextDate(elem, endTimeSelector, time);
			await expect(elem).to.be.golden();
		});

		it('end changes when auto-shift-times', async() => {
			const elem = await fixture(create({ autoShiftTimes: true, endValue: '05:22:00', startValue: '03:30:00' }), { viewport });
			await changeInnerInputTextDate(elem, startTimeSelector, '13:00:00');
			await expect(elem).to.be.golden();
		});

		describe('bad input', () => {

			describe('function', () => {

				it('open start', async() => {
					const elem = await fixture(create({ endValue: time, startValue: laterTime }), { viewport });
					await sendKeysElem(elem, 'press', 'Enter');
					await expect(elem).to.be.golden();
				});

				it('open end', async() => {
					const elem = await fixture(create({ endValue: time, startValue: laterTime }), { viewport });
					await focusElem(elem);
					await sendKeys('press', 'Tab');
					await sendKeys('press', 'Enter');
					await expect(elem).to.be.golden();
				});
			});

			it('invalid then fixed', async() => {
				const elem = await fixture(create({ endValue: time, startValue: laterTime }), { viewport });
				await changeInnerInputTextDate(elem, startTimeSelector, '00:00:00');
				await expect(elem).to.be.golden();
			});

			[
				{ name: 'start equals end', startDate: time, endDate: time },
				{ name: 'start after end', startDate: laterTime, endDate: time }
			].forEach(({ name, startDate, endDate }) => {
				describe(name, () => {

					let elem;
					beforeEach(async() => {
						elem = await fixture(create({ endValue: endDate, startValue: startDate }), { viewport });
					});

					it('basic', async() => {
						await expect(elem).to.be.golden();
					});

					it('focus start', async() => {
						focusElem(elem.shadowRoot.querySelector(startTimeSelector));
						await oneEvent(elem, 'd2l-tooltip-show');
						await expect(elem).to.be.golden();
					});

					it('focus end', async() => {
						focusElem(elem.shadowRoot.querySelector(endTimeSelector));
						await oneEvent(elem, 'd2l-tooltip-show');
						await expect(elem).to.be.golden();
					});
				});
			});
		});

	});

	describe('width change', () => {
		it('resizes correctly when width increased', async() => {
			const wrapper = await fixture(createHiddenLabels({ wrapped: true }), { viewport });
			const elem = wrapper.querySelector('d2l-input-time-range');
			elem.style.maxWidth = '800px';
			wrapper.style.width = '800px';
			await nextFrame();
			await expect(elem).to.be.golden();
		});

		it('resizes correctly when width decreased', async() => {
			const elem = await fixture(createHiddenLabels(), { viewport });
			elem.style.maxWidth = '240px';
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
			const elem = await fixture(`<${tag}></${tag}>`, { viewport: { width: 250 } });
			await expect(elem).to.be.golden();
		});
	});

});
