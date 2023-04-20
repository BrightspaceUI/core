import { focusOnInput, resetInnerTimeInput } from './input-helper.js';
import { focusWithKeyboard, VisualDiff } from '@brightspace-ui/visual-diff';
import puppeteer from 'puppeteer';

async function getRect(page, selector, tag) {
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
}

describe('d2l-input-date-time', () => {

	const visualDiff = new VisualDiff('input-date-time', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser, { viewport: { width: 800, height: 1500 } });
		await page.goto(`${visualDiff.getBaseUrl()}/components/inputs/test/input-date-time.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();

		// #opened being opened causes issues with focus with other inputs being opened.
		// Putting this first in case tests are run in isolation.
		await page.$eval('#opened', (elem) => elem.removeAttribute('opened'));
	});

	after(async() => await browser.close());

	async function changeInnerElem(page, selector, inputSelector, date, waitForTime) {
		return page.$eval(selector, (elem, inputSelector, date, waitForTime) => {
			const dateElem = elem.shadowRoot.querySelector(inputSelector);
			dateElem.value = date;
			const e = new Event(
				'change',
				{ bubbles: true, composed: false }
			);
			dateElem.dispatchEvent(e);
			if (waitForTime) {
				return new Promise((resolve) => {
					elem.updateComplete.then(() => {
						const timeElem = elem.shadowRoot.querySelector('d2l-input-time');
						timeElem.addEventListener('d2l-input-time-hidden-content-width-change', resolve);
					});
				});
			}
		}, inputSelector, date, waitForTime);
	}

	[
		'basic',
		'disabled',
		'labelled',
		'label-hidden',
		'invalid-value',
		'localized',
		'no-value',
		'required'
	].forEach((name) => {
		it(name, async function() {
			const rect = await visualDiff.getRect(page, `#${name}`);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

	it('basic-focus', async function() {
		await focusOnInput(page, '#basic', 'd2l-input-date');
		const rect = await visualDiff.getRect(page, '#basic');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('required focus then blur', async function() {
		await focusWithKeyboard(page, '#required');
		await page.$eval('#required', (elem) => {
			const inputElem = elem.shadowRoot.querySelector('d2l-input-date');
			inputElem.blur();
		});
		const rect = await visualDiff.getRect(page, '#required');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('required focus then blur then fix', async function() {
		await changeInnerElem(page, '#required', 'd2l-input-date', ''); // reset width change event
		await focusWithKeyboard(page, '#required');
		await page.$eval('#required', (elem) => elem.blur());
		await changeInnerElem(page, '#required', 'd2l-input-date', '2018-01-20', true);
		const rect = await visualDiff.getRect(page, '#required');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	describe('timezone', () => {
		afterEach(async() => {
			await page.evaluate(() => {
				document.querySelector('html').setAttribute('data-timezone', '{"name":"Canada - Toronto", "identifier":"America/Toronto"}');
			});
		});

		it('change', async function() {
			await page.evaluate(() => {
				document.querySelector('html').setAttribute('data-timezone', '{"name":"Canada - Vancouver", "identifier":"America/Vancouver"}');
			});
			const rect = await visualDiff.getRect(page, '#basic');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

	describe('opened behavior', () => {

		before(async() => {
			await page.reload();
			await page.$eval('#opened', async(elem) => await elem.updateComplete);
		});

		after(async() => {
			await page.$eval('#opened-skeleton', (elem) => elem.removeAttribute('opened'));
		});

		it('intially opened', async function() {
			const rect = await getRect(page, '#opened', 'd2l-input-date');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('opened with time', async function() {
			await page.$eval('#opened', (elem) => elem.removeAttribute('opened'));
			await page.$eval('#opened-time', (elem) => elem.opened = true);
			const rect = await getRect(page, '#opened-time', 'd2l-input-date');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('opened-disabled', async function() {
			await page.$eval('#opened-time', (elem) => elem.opened = false);
			const rect = await visualDiff.getRect(page, '#opened-disabled');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('opened-skeleton', async function() {
			const rect = await visualDiff.getRect(page, '#opened-skeleton');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('opened-disabled remove disabled', async function() {
			await page.$eval('#opened-disabled', (elem) => elem.removeAttribute('disabled'));
			const rect = await getRect(page, '#opened-disabled', 'd2l-input-date');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('opened-skeleton remove skeleton', async function() {
			await page.$eval('#opened-disabled', (elem) => elem.removeAttribute('opened'));
			await page.$eval('#opened-skeleton', (elem) => elem.removeAttribute('skeleton'));
			const rect = await getRect(page, '#opened-skeleton', 'd2l-input-date');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

	describe('open behavior', () => {

		it('open date', async function() {
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

		it('open time', async function() {
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
		it.skip('change time', async function() {
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

		it('change date', async function() {
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

		it('change time localized', async function() {
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

		it('change date localized', async function() {
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

		it('clear date', async function() {
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

		it('select date after clear', async function() {
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

			it('open', async function() {
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

				it('basic', async function() {
					const rect = await visualDiff.getRect(page, '#min-max');
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});

				it('focus date', async function() {
					await focusOnInput(page, '#min-max', dateSelector);
					const rect = await getRectInnerTooltip(page, '#min-max');
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});

				it('focus time', async function() {
					await focusOnInput(page, '#min-max', timeSelector);
					const rect = await getRectInnerTooltip(page, '#min-max');
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});
			});
		});
	});

	describe('width change', () => {
		it('resizes correctly when width decreased', async function() {
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
			it(name, async function() {
				await page.$eval(`#${name}`, (elem) => elem.skeleton = true);
				const rect = await visualDiff.getRect(page, `#${name}`);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});
		});
	});

});
