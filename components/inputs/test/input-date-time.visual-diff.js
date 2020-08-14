const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-input-date-time', () => {

	const visualDiff = new VisualDiff('input-date-time', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser, { viewport: { width: 800, height: 900 } });
		await page.goto(`${visualDiff.getBaseUrl()}/components/inputs/test/input-date-time.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	after(async() => await browser.close());

	[
		'basic',
		'disabled',
		'labelled',
		'invalid-value',
		'no-value'
	].forEach((name) => {
		it(name, async function() {
			const rect = await visualDiff.getRect(page, `#${name}`);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

	it('basic-focus', async function() {
		await page.$eval('#basic', (elem) => elem.focus());
		const rect = await visualDiff.getRect(page, '#basic');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	describe('functionality', () => {
		it('change time', async function() {
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
			await page.$eval('#basic', (elem) => {
				const dateSelector = elem.shadowRoot.querySelector('d2l-input-date');
				dateSelector.value = '2018-01-20';
				const e = new Event(
					'change',
					{ bubbles: true, composed: true }
				);
				dateSelector.dispatchEvent(e);
			});
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

		async function changeInnerElem(page, selector, inputSelector, date) {
			return page.$eval(selector, (elem, inputSelector, date) => {
				const dateElem = elem.shadowRoot.querySelector(inputSelector);
				dateElem.value = date;
				const e = new Event(
					'change',
					{ bubbles: true, composed: false }
				);
				dateElem.dispatchEvent(e);
			}, inputSelector, date);
		}

		async function focusOnInput(page, selector, inputSelector) {
			return page.$eval(selector, (elem, inputSelector) => {
				elem.blur();
				const input = elem.shadowRoot.querySelector(inputSelector);
				return new Promise((resolve) => {
					elem.addEventListener('d2l-tooltip-show', resolve, { once: true });
					input.focus();
				});
			}, inputSelector);
		}

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
					await changeInnerElem(page, '#min-max', timeSelector, '');
					await changeInnerElem(page, '#min-max', dateSelector, testCase.date);
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
});
