const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');
const helper = require('./input-helper.js');

describe('d2l-input-date-range', () => {

	const visualDiff = new VisualDiff('input-date-range', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await browser.newPage();
		await page.setViewport({width: 800, height: 1300, deviceScaleFactor: 2});
		await page.goto(`${visualDiff.getBaseUrl()}/components/inputs/test/input-date-range.visual-diff.html`, {waitUntil: ['networkidle0', 'load']});
		await page.bringToFront();
	});

	after(async() => await browser.close());

	[
		'basic',
		'basic-wrapped',
		'disabled',
		'invalid-start-value',
		'labelled',
		'label-hidden',
		'start-end-label',
		'start-end-value'
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

	describe('validation', () => {

		const STARTDATESELECTOR = 'd2l-input-date.d2l-input-date-range-start';
		const ENDDATESELECTOR = 'd2l-input-date.d2l-input-date-range-end';

		// min = 2019-01-01, max = 2022-01-01
		const DATEBEFOREMIN = '08/07/2016';
		const DATEFURTHERBEFOREMIN = '02/03/2015';
		const DATEINRANGE = '06/06/2019';
		const DATELATERINRANGE = '07/07/2021';
		const DATEAFTERMAX = '10/31/2025';
		const DATEFURTHERAFTERMAX = '12/31/2027';

		async function changeInnerInputTextDate(page, selector, inputSelector, date) {
			return page.$eval(selector, (elem, inputSelector, date) => {
				const dateElem = elem.shadowRoot.querySelector(inputSelector);
				const innerInput = dateElem.shadowRoot.querySelector('d2l-input-text');
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
					const tooltip = input.shadowRoot.querySelector('d2l-tooltip');
					if (tooltip) {
						tooltip.addEventListener('d2l-tooltip-show', resolve, { once: true });
					} else {
						resolve();
					}
					input.focus();
				});
			}, inputSelector);
		}

		[
			{name: 'start date equals end date', startDate: DATEINRANGE, endDate: DATEINRANGE},
			{name: 'start date after end date', startDate: DATELATERINRANGE, endDate: DATEINRANGE}
		].forEach((testCase) => {
			describe(testCase.name, () => {
				before(async() => {
					await page.$eval('#min-max', (elem) => elem.blur());
					await changeInnerInputTextDate(page, '#min-max', STARTDATESELECTOR, testCase.startDate);
					await changeInnerInputTextDate(page, '#min-max', ENDDATESELECTOR, testCase.endDate);
				});

				it('basic', async function() {
					const rect = await visualDiff.getRect(page, '#min-max');
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});

				it('focus start date', async function() {
					await focusOnInput(page, '#min-max', STARTDATESELECTOR);
					const rect = await helper.getRectTooltip(page, '#min-max');
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});

				it('focus end date', async function() {
					await focusOnInput(page, '#min-max', ENDDATESELECTOR);
					const rect = await helper.getRectTooltip(page, '#min-max', 1);
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});
			});
		});

		[
			{name: 'start date before min value', startDate: DATEBEFOREMIN, endDate: DATEINRANGE, startDateTooltip: true, endDateTooltip: false},
			{name: 'end date after max value', startDate: DATEINRANGE, endDate: DATEAFTERMAX, startDateTooltip: false, endDateTooltip: true}
		].forEach((testCase) => {
			describe(testCase.name, () => {
				before(async() => {
					await page.$eval('#min-max', (elem) => elem.blur());
					await changeInnerInputTextDate(page, '#min-max', STARTDATESELECTOR, testCase.startDate);
					await changeInnerInputTextDate(page, '#min-max', ENDDATESELECTOR, testCase.endDate);
				});

				it('basic', async function() {
					const rect = await visualDiff.getRect(page, '#min-max');
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});

				it('focus start date', async function() {
					await focusOnInput(page, '#min-max', STARTDATESELECTOR);
					let rect;
					if (testCase.startDateTooltip) {
						rect = await getRectInnerTooltip(page, '#min-max', STARTDATESELECTOR);
					} else {
						rect = await visualDiff.getRect(page, '#min-max');
					}
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});

				it('focus end date', async function() {
					await focusOnInput(page, '#min-max', ENDDATESELECTOR);
					let rect;
					if (testCase.endDateTooltip) {
						rect = await getRectInnerTooltip(page, '#min-max', ENDDATESELECTOR);
					} else {
						rect = await visualDiff.getRect(page, '#min-max');
					}
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});

				async function getRectInnerTooltip(page, selector, inputDateSelector) {
					return page.$eval(selector, (elem, inputDateSelector) => {
						const inputDate = elem.shadowRoot.querySelector(inputDateSelector);
						const content = inputDate.shadowRoot.querySelector('d2l-tooltip');
						const contentWidth = content.shadowRoot.querySelector('.d2l-tooltip-content');
						const openerRect = elem.getBoundingClientRect();
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
					}, inputDateSelector);
				}
			});
		});

		describe('input-date error combined with range error', () => {

			[
				{
					name: 'start date before min value, end date before start date',
					startDate: DATEBEFOREMIN,
					endDate: DATEFURTHERBEFOREMIN,
					changeStartDateFirst: true
				}, {
					name: 'start date valid, end date before start date and before min value',
					startDate: DATEINRANGE,
					endDate: DATEBEFOREMIN,
					changeStartDateFirst: true
				}, {
					name: 'end date after max value, start date after end date',
					startDate: DATEFURTHERAFTERMAX,
					endDate: DATEAFTERMAX,
					changeStartDateFirst: false
				}, {
					name: 'end date valid, start date after end date and after max value',
					startDate: DATEAFTERMAX,
					endDate: DATEINRANGE,
					changeStartDateFirst: false
				}
			].forEach((testCase) => {
				describe(testCase.name, () => {
					before(async() => {
						await changeInnerInputTextDate(page, '#min-max', STARTDATESELECTOR, '');
						await changeInnerInputTextDate(page, '#min-max', ENDDATESELECTOR, '');
						await page.$eval('#min-max', (elem) => elem.blur());
						await changeInnerInputTextDate(page, '#min-max', testCase.changeStartDateFirst ? STARTDATESELECTOR : ENDDATESELECTOR, testCase.changeStartDateFirst ? testCase.startDate : testCase.endDate);
						await changeInnerInputTextDate(page, '#min-max', testCase.changeStartDateFirst ? ENDDATESELECTOR : STARTDATESELECTOR, testCase.changeStartDateFirst ? testCase.endDate : testCase.startDate);
					});

					it('focus start date', async function() {
						await focusOnInput(page, '#min-max', STARTDATESELECTOR);
						const rect = await helper.getRectTooltip(page, '#min-max');
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
					});

					it('focus end date', async function() {
						await focusOnInput(page, '#min-max', ENDDATESELECTOR);
						const rect = await helper.getRectTooltip(page, '#min-max', 1);
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
					});
				});
			});
		});

	});

});
