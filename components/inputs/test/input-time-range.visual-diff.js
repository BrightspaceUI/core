const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');
const helper = require('./input-helper.js');

describe('d2l-input-time-range', () => {

	const visualDiff = new VisualDiff('input-time-range', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser, { viewport: { width: 800, height: 1500 } });
		await page.goto(`${visualDiff.getBaseUrl()}/components/inputs/test/input-time-range.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	after(async() => await browser.close());

	[
		'basic',
		'basic-wrapped',
		'disabled',
		'end-value',
		'invalid-end-value',
		'invalid-start-value',
		'labelled',
		'label-hidden',
		'required',
		'start-end-label',
		'start-end-value',
		'start-value'
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

	describe('bad input', () => {

		const startTimeSelector = 'd2l-input-time.d2l-input-time-range-start';
		const endTimeSelector = 'd2l-input-time.d2l-input-time-range-end';

		const time = '13:00:00';
		const laterTime = '15:45:30';

		async function changeInnerInputTextDate(page, selector, inputSelector, date) {
			return page.$eval(selector, (elem, inputSelector, date) => {
				const dateElem = elem.shadowRoot.querySelector(inputSelector);
				const innerInput = dateElem.shadowRoot.querySelector('input');
				innerInput.value = date;
				const e = new Event(
					'change',
					{ bubbles: true, composed: false }
				);
				innerInput.dispatchEvent(e);
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

		describe('function', () => {
			before(async() => {
				await page.$eval('#basic', (elem) => elem.blur());
				await changeInnerInputTextDate(page, '#basic', startTimeSelector, laterTime);
				await changeInnerInputTextDate(page, '#basic', endTimeSelector, time);
			});

			after(async() => {
				await page.reload();
			});

			async function getRect(page, timePickerIndex) {
				return await page.$eval('#basic', (elem, timePickerIndex) => {
					const input = elem.shadowRoot.querySelectorAll('d2l-input-time')[timePickerIndex];
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
				}, timePickerIndex);
			}

			it('open start', async function() {
				await page.$eval('#basic', (elem) => {
					const input = elem.shadowRoot.querySelector('d2l-input-time');
					const input2 = input.shadowRoot.querySelector('input');
					const eventObj = document.createEvent('Events');
					eventObj.initEvent('keydown', true, true);
					eventObj.keyCode = 13;
					input2.dispatchEvent(eventObj);
				});
				const rect = await getRect(page, 0);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it('open end', async function() {
				await page.$eval('#basic', (elem) => {
					const input = elem.shadowRoot.querySelectorAll('d2l-input-time')[1];
					const input2 = input.shadowRoot.querySelector('input');
					const eventObj = document.createEvent('Events');
					eventObj.initEvent('keydown', true, true);
					eventObj.keyCode = 13;
					input2.dispatchEvent(eventObj);
				});
				const rect = await getRect(page, 1);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});
		});

		it('invalid then fixed', async function() {
			await page.$eval('#basic', (elem) => elem.blur());
			await changeInnerInputTextDate(page, '#basic', startTimeSelector, laterTime);
			await changeInnerInputTextDate(page, '#basic', endTimeSelector, time);
			await changeInnerInputTextDate(page, '#basic', startTimeSelector, '00:00:00');
			const rect = await visualDiff.getRect(page, '#basic');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		[
			{ name: 'start equals end', startDate: time, endDate: time },
			{ name: 'start after end', startDate: laterTime, endDate: time }
		].forEach((testCase) => {
			describe(testCase.name, () => {
				before(async() => {
					await page.$eval('#basic', (elem) => elem.blur());
					await changeInnerInputTextDate(page, '#basic', startTimeSelector, testCase.startDate);
					await changeInnerInputTextDate(page, '#basic', endTimeSelector, testCase.endDate);
				});

				it('basic', async function() {
					const rect = await visualDiff.getRect(page, '#basic');
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});

				it('focus start', async function() {
					await focusOnInput(page, '#basic', startTimeSelector);
					const rect = await helper.getRectTooltip(page, '#basic');
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});

				it('focus end', async function() {
					await focusOnInput(page, '#basic', endTimeSelector);
					const rect = await helper.getRectTooltip(page, '#basic', 1);
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});
			});
		});
	});

});
