import '../input-date-time.js';
import { expect, fixture, focusElem, html, oneEvent, sendKeys, sendKeysElem } from '@brightspace-ui/testing';
import { reset, useFakeTimers } from 'sinon';
import { ifDefined } from 'lit/directives/if-defined.js';
import { inlineHelpFixtures } from './input-shared-content.js';

const create = (opts = {}) => {
	const { disabled, label, labelHidden, localized, maxValue, minValue, opened, required, skeleton, value } = {
		disabled: false,
		label: 'Start Date',
		labelHidden: true,
		localized: false,
		opened: false,
		required: false,
		skeleton: false,
		...opts
	};
	return html`
		<d2l-input-date-time
			?disabled="${disabled}"
			label="${label}"
			?label-hidden="${labelHidden}"
			?localized="${localized}"
			max-value="${ifDefined(maxValue)}"
			min-value="${ifDefined(minValue)}"
			?opened="${opened}"
			?required="${required}"
			?skeleton="${skeleton}"
			value="${ifDefined(value)}"></d2l-input-date-time>
	`;
};

const basicFixture = create({ value: '2019-02-01T12:00:00.000Z' });
const localizedFixture = create({ localized: true, value: '2019-03-02T05:00:00.000Z' });
const requiredFixture = create({ labelHidden: false, required: true });

const newToday = new Date('2018-02-12T12:00Z');

describe('d2l-input-date-time', () => {

	before(() => useFakeTimers({ now: newToday.getTime(), toFake: ['Date'] }));
	after(() => reset());

	async function changeInnerElem(elem, inputSelector, date, waitForTime) {
		const dateElem = elem.shadowRoot.querySelector(inputSelector);
		dateElem.value = date;
		dateElem.dispatchEvent(new Event('change', { bubbles: true, composed: false }));
		if (waitForTime) {
			await elem.updateComplete;
			await oneEvent(elem.shadowRoot.querySelector('d2l-input-time'), 'd2l-input-time-hidden-content-width-change');
		}
	}

	[
		{ name: 'basic', template: basicFixture },
		{ name: 'basic-focus', template: basicFixture, focus: true },
		{ name: 'disabled', template: create({ disabled: true, label: 'End Date', labelHidden: false, value: '1990-01-01T23:00:00.000Z' }) },
		{ name: 'labelled', template: create({ labelHidden: false, value: '2019-03-02T05:00:00.000Z' }) },
		{ name: 'labelled-skeleton', template: create({ labelHidden: false, skeleton: true, value: '2019-03-02T05:00:00.000Z' }) },
		{ name: 'label-hidden', template: create({ value: '2019-03-02T05:00:00.000Z' }) },
		{ name: 'label-hidden-skeleton', template: create({ skeleton: true, value: '2019-03-02T05:00:00.000Z' }) },
		{ name: 'invalid-value', template: create({ labelHidden: false, value: '2019-03-02' }) },
		{ name: 'localized', template: localizedFixture },
		{ name: 'no-value', template: create() },
		{ name: 'required', template: requiredFixture },
		{ name: 'inline-help', template: inlineHelpFixtures.dateTime.normal },
		{ name: 'inline-help-multiline', template: inlineHelpFixtures.dateTime.multiline },
	].forEach(({ name, focus, template }) => {
		it(name, async() => {
			const elem = await fixture(template);
			if (focus) {
				focusElem(elem.shadowRoot.querySelector('d2l-input-date'));
				await oneEvent(elem, 'd2l-tooltip-show');
			}
			await expect(elem).to.be.golden();
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
		await changeInnerElem(elem, 'd2l-input-date', '2018-01-20', true);
		await expect(elem).to.be.golden();
	});

	describe('opened behavior', () => {

		it('intially opened', async() => {
			const elem = await fixture(create({ opened: true }));
			await expect(elem).to.be.golden();
		});

		it('opened with time', async() => {
			const elem = await fixture(create({ opened: true, value: '2019-03-02T05:00:00.000Z' }));
			await expect(elem).to.be.golden();
		});

		it('opened-disabled', async() => {
			const elem = await fixture(create({ opened: true, disabled: true }));
			await expect(elem).to.be.golden();
		});

		it('opened-skeleton', async() => {
			const elem = await fixture(create({ opened: true, skeleton: true }));
			await expect(elem).to.be.golden();
		});

		it('opened-disabled remove disabled', async() => {
			const elem = await fixture(create({ opened: true, disabled: true }));
			setTimeout(() => elem.removeAttribute('disabled'));
			await oneEvent(elem, 'd2l-dropdown-open');
			await expect(elem).to.be.golden();
		});

		it('opened-skeleton remove skeleton', async() => {
			const elem = await fixture(create({ opened: true, skeleton: true }));
			setTimeout(() => elem.removeAttribute('skeleton'));
			await oneEvent(elem, 'd2l-dropdown-open');
			await expect(elem).to.be.golden();
		});
	});

	describe('open behavior', () => {

		it('open date', async() => {
			const elem = await fixture(basicFixture);
			const textInput = elem.shadowRoot.querySelector('d2l-input-date').shadowRoot.querySelector('d2l-input-text');
			await sendKeysElem(textInput, 'press', 'Enter');
			await expect(elem).to.be.golden();
		});

		it('open time', async() => {
			const elem = await fixture(basicFixture);
			const textInput = elem.shadowRoot.querySelector('d2l-input-time').shadowRoot.querySelector('input');
			await sendKeysElem(textInput, 'press', 'Enter');
			await expect(elem).to.be.golden();
		});
	});

	describe('functionality', () => {

		it('change date', async() => {
			const elem = await fixture(basicFixture);
			await changeInnerElem(elem, 'd2l-input-date', '2020-12-15', false);
			await expect(elem).to.be.golden();
		});

		it('change time localized', async() => {
			const elem = await fixture(localizedFixture);
			await changeInnerElem(elem, 'd2l-input-time', '15:22:00', false);
			await expect(elem).to.be.golden();
		});

		it('change date localized', async() => {
			const elem = await fixture(localizedFixture);
			await changeInnerElem(elem, 'd2l-input-date', '2020-12-15', false);
			await expect(elem).to.be.golden();
		});

		it('clear date', async() => {
			const elem = await fixture(basicFixture);
			await changeInnerElem(elem, 'd2l-input-date', '', false);
			await expect(elem).to.be.golden();
		});

		it('select date after clear', async() => {
			const elem = await fixture(basicFixture);
			await changeInnerElem(elem, 'd2l-input-date', '', false);
			await changeInnerElem(elem, 'd2l-input-date', '2018-01-20', true);
			await expect(elem).to.be.golden();
		});

	});

	describe('outside range', () => {

		// min = 2018-02-13T18:00:00.000Z, max = 2018-02-27T05:00:00.000Z
		const dateBeforeMin = '2018-01-20';
		const dateAfterMax = '2018-03-20';
		const timeBeforeMin = '10:22:00';
		const timeAfterMax = '20:22:00';
		const timeInRange = '16:00:00';

		[
			{ name: 'date before min', date: dateBeforeMin, time: '17:00:00' },
			{ name: 'time before min', date: '2018-02-13', time: timeBeforeMin },
			{ name: 'date after max', date: dateAfterMax, time: timeInRange },
			{ name: 'time after max', date: '2018-02-27', time: timeAfterMax }
		].forEach(({ name, date, time }) => {
			describe(name, () => {

				let elem;
				beforeEach(async() => {
					elem = await fixture(create({
						maxValue: '2018-02-27T05:00:00.000Z',
						minValue: '2018-02-13T18:00:00.000Z',
						value: `${date}T${time}.000Z`
					}));
				});

				it('basic', async() => {
					await expect(elem).to.be.golden();
				});

				it('focus date', async() => {
					focusElem(elem.shadowRoot.querySelector('d2l-input-date'));
					await oneEvent(elem, 'd2l-tooltip-show');
					await expect(elem).to.be.golden();
				});

				it('focus time', async() => {
					focusElem(elem.shadowRoot.querySelector('d2l-input-time'));
					await oneEvent(elem, 'd2l-tooltip-show');
					await expect(elem).to.be.golden();
				});
			});
		});
	});

	describe('width change', () => {
		it('resizes correctly when width decreased', async() => {
			const elem = await fixture(create({ value: '2018-01-20T5:01:00.000Z' }));
			elem.style.maxWidth = '200px';
			await elem.updateComplete;
			await expect(elem).to.be.golden();
		});
	});

});
