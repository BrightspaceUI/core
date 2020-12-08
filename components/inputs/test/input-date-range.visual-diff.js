const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');
const helper = require('./input-helper.js');

describe.skip('d2l-input-date-range', () => {

	const visualDiff = new VisualDiff('input-date-range', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser, { viewport: { width: 800, height: 2000 } });
		await page.goto(`${visualDiff.getBaseUrl()}/components/inputs/test/input-date-range.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	after(async() => await browser.close());

	async function validateInput(page, selector) {
		return page.$eval(selector, elem => {
			elem.validate();
		});
	}

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

	async function getRectInnerTooltip(page, selector, inputDateSelector) {
		return page.$eval(selector, (elem, inputDateSelector) => {
			let content = elem.shadowRoot.querySelector('d2l-tooltip');
			if (!content || !content.showing) {
				const inputDate = elem.shadowRoot.querySelector(inputDateSelector);
				content = inputDate.shadowRoot.querySelector('d2l-tooltip');
			}
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

	[
		'basic',
		'basic-wrapped',
		'disabled',
		'invalid-start-value',
		'hidden-labels',
		'labelled',
		'label-hidden',
		'required',
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
		const rect = await getRectInnerTooltip(page, '#basic', 'd2l-input-date.d2l-input-date-range-start');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('required focus then blur', async function() {
		await page.$eval('#required', (elem) => elem.focus());
		await page.$eval('#required', (elem) => {
			const inputElem = elem.shadowRoot.querySelector('d2l-input-date');
			inputElem.blur();
		});
		const rect = await visualDiff.getRect(page, '#required');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('required focus then blur then fix', async function() {
		await page.$eval('#required', (elem) => elem.focus());
		await page.$eval('#required', (elem) => {
			const inputElem = elem.shadowRoot.querySelector('d2l-input-date');
			inputElem.blur();
		});
		await changeInnerInputTextDate(page, '#required', 'd2l-input-date.d2l-input-date-range-start', '07/06/2023');
		const rect = await visualDiff.getRect(page, '#required');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
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

		it('start equals end when inclusive', async function() {
			await changeInnerInputTextDate(page, '#inclusive', startDateSelector, dateInRange);
			await changeInnerInputTextDate(page, '#inclusive', endDateSelector, dateInRange);

			const rect = await visualDiff.getRect(page, '#inclusive');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('start changes when autoShiftDates', async function() {
			await changeInnerInputTextDate(page, '#auto-shift-dates', startDateSelector, '12/05/2020');

			const rect = await visualDiff.getRect(page, '#auto-shift-dates');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		describe('bad input', () => {

			describe('function', () => {
				after(async() => {
					await page.reload();
				});

				it('open', async function() {
					await page.$eval('#min-max', (elem) => elem.blur());
					await changeInnerInputTextDate(page, '#min-max', startDateSelector, dateLaterInRange);
					await changeInnerInputTextDate(page, '#min-max', endDateSelector, dateInRange);

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
				{ name: 'start equals end', startDate: dateInRange, endDate: dateInRange },
				{ name: 'start after end', startDate: dateLaterInRange, endDate: dateInRange }
			].forEach((testCase) => {
				describe(testCase.name, () => {
					before(async() => {
						await page.$eval('#min-max', (elem) => elem.blur());
						await changeInnerInputTextDate(page, '#min-max', startDateSelector, testCase.startDate);
						await changeInnerInputTextDate(page, '#min-max', endDateSelector, testCase.endDate);
					});

					it('basic', async function() {
						const rect = await visualDiff.getRect(page, '#min-max');
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
					});

					it('focus start', async function() {
						await focusOnInput(page, '#min-max', startDateSelector);
						const rect = await helper.getRectTooltip(page, '#min-max');
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
					});

					it('focus end', async function() {
						await focusOnInput(page, '#min-max', endDateSelector);
						const rect = await helper.getRectTooltip(page, '#min-max', 1);
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
					});
				});
			});
		});

		describe('outside range', () => {
			[
				{ name: 'start before min', startDate: dateBeforeMin, endDate: dateInRange },
				{ name: 'end after max', startDate: dateInRange, endDate: dateAfterMax }
			].forEach((testCase) => {
				describe(testCase.name, () => {
					before(async() => {
						await changeInnerInputTextDate(page, '#min-max', startDateSelector, '');
						await changeInnerInputTextDate(page, '#min-max', endDateSelector, '');
						await changeInnerInputTextDate(page, '#min-max', startDateSelector, testCase.startDate);
						await changeInnerInputTextDate(page, '#min-max', endDateSelector, testCase.endDate);
						await validateInput(page, '#min-max');
					});

					beforeEach(async() => {
						await page.$eval('#min-max', (elem) => elem.blur());
					});

					it('basic', async function() {
						const rect = await visualDiff.getRect(page, '#min-max');
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
					});

					it('focus start', async function() {
						await focusOnInput(page, '#min-max', startDateSelector);
						const rect = await getRectInnerTooltip(page, '#min-max', startDateSelector);
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
					});

					it('focus end', async function() {
						await focusOnInput(page, '#min-max', endDateSelector);
						const rect = await getRectInnerTooltip(page, '#min-max', endDateSelector);
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
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
			].forEach((testCase) => {
				describe(testCase.name, () => {
					before(async() => {
						await changeInnerInputTextDate(page, '#min-max', startDateSelector, '');
						await changeInnerInputTextDate(page, '#min-max', endDateSelector, '');
						await changeInnerInputTextDate(page, '#min-max', testCase.changeStartDateFirst ? startDateSelector : endDateSelector, testCase.changeStartDateFirst ? testCase.startDate : testCase.endDate);
						await changeInnerInputTextDate(page, '#min-max', testCase.changeStartDateFirst ? endDateSelector : startDateSelector, testCase.changeStartDateFirst ? testCase.endDate : testCase.startDate);
						await validateInput(page, '#min-max');
					});

					it('focus start', async function() {
						await focusOnInput(page, '#min-max', startDateSelector);
						const rect = await getRectInnerTooltip(page, '#min-max', startDateSelector);
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
					});

					it('focus end', async function() {
						await focusOnInput(page, '#min-max', endDateSelector);
						const rect = await getRectInnerTooltip(page, '#min-max', endDateSelector);
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
					});
				});
			});
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
