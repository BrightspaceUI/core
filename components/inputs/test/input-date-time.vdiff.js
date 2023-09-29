import '../input-date-time.js';
import { clickElem, expect, fixture, focusElem, html, nextFrame, oneEvent, sendKeys, sendKeysElem } from '@brightspace-ui/testing';
import { reset, useFakeTimers } from 'sinon';
import { ifDefined } from 'lit-html/directives/if-defined.js';

const create = (opts = {}) => {
	const { disabled, emptyText, label, labelHidden, localized, maxValue, minValue, opened, required, skeleton, value } = {
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
			empty-text="${ifDefined(emptyText)}"
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
const requiredFixture = create({ labelHidden: false, required: true });

/*async function getRect(page, selector, tag) {
	return await page.$eval(selector, (elem, tag) => {
		const input = elem.shadowRoot.querySelector(tag);
		const content = input.shadowRoot.querySelector('[dropdown-content]');
		const opener = content.__getOpener();
		const contentWidth = content.shadowRoot.querySelector('.d2l-dropdown-content-width');
		const openerRect = opener.getBoundingClientRect();
		const contentRect = contentWidth.getBoundingClientRect();
		const x = Math.min(openerRect.x, contentRect.x);
		const y = Math.min(openerRect.y, contentRect.y);
		const width = Math.max(openerRect.right, contentRect.right) - x;
		const height = Math.max(openerRect.bottom, contentRect.bottom) - y;
		return {
			x: x - 10,
			y: y - 10,
			width: width + 20,
			height: height + 20
		};
	}, tag);
}*/

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
		{ name: 'label-hidden', template: create({ value: '2019-03-02T05:00:00.000Z' }) },
		{ name: 'invalid-value', template: create({ labelHidden: false, value: '2019-03-02' }) },
		{ name: 'localized', template: create({ localized: true, value: '2019-03-02T05:00:00.000Z' }) },
		{ name: 'no-value', template: create() },
		{ name: 'required', template: requiredFixture }
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

	/*describe('open behavior', () => {

		it('open date', async() => {
			await page.$eval('#basic', (elem) => {
				const dateInput = elem.shadowRoot.querySelector('d2l-input-date');
				const input = dateInput.shadowRoot.querySelector('d2l-input-text');
				const eventObj = document.createEvent('Events');
				eventObj.initEvent('keydown', true, true);
				eventObj.keyCode = 13;
				input.dispatchEvent(eventObj);
			});
			const rect = await getRect(page, '#basic', 'd2l-input-date');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('open time', async() => {
			await resetInnerTimeInput(page, '#basic'); // Needed for retries
			await page.$eval('#basic', async(elem) => {
				const timeInput = elem.shadowRoot.querySelector('d2l-input-time');
				const input = timeInput.shadowRoot.querySelector('input');
				const eventObj = document.createEvent('Events');
				eventObj.initEvent('keydown', true, true);
				eventObj.keyCode = 13;
				input.dispatchEvent(eventObj);
			});

			const rect = await getRect(page, '#basic', 'd2l-input-time');
			// confirm that date did not also open
			rect.x -= 100;
			rect.y -= 30;
			rect.width += 100;
			rect.height += 30;

			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

	describe('functionality', () => {
		it.skip('change time', async() => {
			await page.$eval('#basic', (elem) => {
				elem.blur();
				const timeSelector = elem.shadowRoot.querySelector('d2l-input-time');
				timeSelector.value = '15:22:00';
				const e = new Event(
					'change',
					{ bubbles: true, composed: true }
				);
				timeSelector.dispatchEvent(e);
			});
			const rect = await visualDiff.getRect(page, '#basic');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('change date', async() => {
			await page.$eval('#basic', (elem) => {
				const dateSelector = elem.shadowRoot.querySelector('d2l-input-date');
				dateSelector.value = '2020-12-15';
				const e = new Event(
					'change',
					{ bubbles: true, composed: true }
				);
				dateSelector.dispatchEvent(e);
			});
			const rect = await visualDiff.getRect(page, '#basic');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('change time localized', async() => {
			await page.$eval('#localized', (elem) => {
				elem.blur();
				const timeSelector = elem.shadowRoot.querySelector('d2l-input-time');
				timeSelector.value = '15:22:00';
				const e = new Event(
					'change',
					{ bubbles: true, composed: true }
				);
				timeSelector.dispatchEvent(e);
			});
			const rect = await visualDiff.getRect(page, '#localized');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('change date localized', async() => {
			await page.$eval('#localized', (elem) => {
				const dateSelector = elem.shadowRoot.querySelector('d2l-input-date');
				dateSelector.value = '2020-12-15';
				const e = new Event(
					'change',
					{ bubbles: true, composed: true }
				);
				dateSelector.dispatchEvent(e);
			});
			const rect = await visualDiff.getRect(page, '#localized');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('clear date', async() => {
			await page.$eval('#basic', (elem) => {
				const dateSelector = elem.shadowRoot.querySelector('d2l-input-date');
				dateSelector.value = '';
				const e = new Event(
					'change',
					{ bubbles: true, composed: true }
				);
				dateSelector.dispatchEvent(e);
			});
			const rect = await visualDiff.getRect(page, '#basic');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('select date after clear', async() => {
			await changeInnerElem(page, '#basic', 'd2l-input-date', ''); // reset width change event
			await changeInnerElem(page, '#basic', 'd2l-input-date', '2018-01-20', true);
			const rect = await visualDiff.getRect(page, '#basic');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

	});

	describe('outside range', () => {

		// min = 2018-02-13T18:00:00.000Z, max = 2018-02-27T05:00:00.000Z
		const dateBeforeMin = '2018-01-20';
		const dateAfterMax = '2018-03-20';
		const timeBeforeMin = '05:22:00';
		const timeAfterMax = '15:22:00';
		const timeInRange = '12:00:00';

		const dateSelector = 'd2l-input-date';
		const timeSelector = 'd2l-input-time';

		async function getRectInnerTooltip(page, selector) {
			return page.$eval(selector, (elem) => {
				const tooltip = elem.shadowRoot.querySelector('d2l-tooltip');
				const tooltipContent = tooltip.shadowRoot.querySelector('.d2l-tooltip-content');
				const openerRect = elem.getBoundingClientRect();
				const contentRect = tooltipContent.getBoundingClientRect();
				const x = Math.min(openerRect.x, contentRect.x);
				const y = Math.min(openerRect.y, contentRect.y);
				const width = Math.max(openerRect.right, contentRect.right) - x;
				const height = Math.max(openerRect.bottom, contentRect.bottom) - y;
				return {
					x: x - 10,
					y: y - 10,
					width: width + 20,
					height: height + 20
				};
			});
		}

		describe.skip('function', () => {
			before(async() => {
				await page.reload();
			});

			after(async() => {
				await page.reload();
			});

			it('open', async() => {
				await page.$eval('#min-max', (elem) => elem.blur());
				await changeInnerElem(page, '#min-max', dateSelector, dateBeforeMin);
				await changeInnerElem(page, '#min-max', timeSelector, timeInRange);

				await page.$eval('#min-max', (elem) => {
					const input = elem.shadowRoot.querySelector('d2l-input-date');
					const input2 = input.shadowRoot.querySelector('d2l-input-text');
					const eventObj = document.createEvent('Events');
					eventObj.initEvent('keydown', true, true);
					eventObj.keyCode = 13;
					input2.dispatchEvent(eventObj);
				});

				const rect = await page.$eval('#min-max', (elem) => {
					const input = elem.shadowRoot.querySelector('d2l-input-date');
					const content = input.shadowRoot.querySelector('[dropdown-content]');
					const opener = content.__getOpener();
					const contentWidth = content.shadowRoot.querySelector('.d2l-dropdown-content-width');
					const openerRect = opener.getBoundingClientRect();
					const contentRect = contentWidth.getBoundingClientRect();
					const x = Math.min(openerRect.x, contentRect.x);
					const y = Math.min(openerRect.y, contentRect.y);
					const width = Math.max(openerRect.right, contentRect.right) - x;
					const height = Math.max(openerRect.bottom, contentRect.bottom) - y;
					return {
						x: x - 10,
						y: y - 10,
						width: width + 20,
						height: height + 20
					};
				});
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});
		});

		[
			{ name: 'date before min', date: dateBeforeMin, time: timeInRange },
			{ name: 'time before min', date: '2018-02-13', time: timeBeforeMin },
			{ name: 'date after max', date: dateAfterMax, time: timeInRange },
			{ name: 'time after max', date: '2018-02-27', time: timeAfterMax }
		].forEach((testCase) => {
			describe(testCase.name, () => {
				before(async() => {
					await changeInnerElem(page, '#min-max', dateSelector, '');
					await changeInnerElem(page, '#min-max', dateSelector, testCase.date, true);
					await changeInnerElem(page, '#min-max', timeSelector, testCase.time);
				});

				beforeEach(async() => {
					await page.$eval('#min-max', (elem) => elem.blur());
				});

				it('basic', async() => {
					const rect = await visualDiff.getRect(page, '#min-max');
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});

				it('focus date', async() => {
					await focusOnInput(page, '#min-max', dateSelector);
					const rect = await getRectInnerTooltip(page, '#min-max');
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});

				it('focus time', async() => {
					await focusOnInput(page, '#min-max', timeSelector);
					const rect = await getRectInnerTooltip(page, '#min-max');
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});
			});
		});
	});

	describe('width change', () => {
		it('resizes correctly when width decreased', async() => {
			const rect = await page.$eval('#basic', async(elem) => {
				elem.style.maxWidth = '200px';
				await elem.updateComplete;
				const margin = 10;
				const leftMargin = (elem.offsetLeft < margin ? 0 : margin);
				const topMargin = (elem.offsetTop < margin ? 0 : margin);
				return {
					x: elem.offsetLeft - leftMargin,
					y: elem.offsetTop - topMargin,
					width: 200,
					height: 130
				};
			});
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

	describe('skeleton', () => {
		[
			'labelled',
			'label-hidden'
		].forEach((name) => {
			it(name, async() => {
				await page.$eval(`#${name}`, (elem) => elem.skeleton = true);
				const rect = await visualDiff.getRect(page, `#${name}`);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});
		});
	});*/

});
