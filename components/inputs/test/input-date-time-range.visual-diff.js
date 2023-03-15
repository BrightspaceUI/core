import { focusOnInput, getRectTooltip } from './input-helper.js';
import { focusWithKeyboard, VisualDiff } from '@brightspace-ui/visual-diff';
import puppeteer from 'puppeteer';

async function getRect(page, selector, inputNum) {
	return await page.$eval(selector, (elem, inputNum) => {
		const input = elem.shadowRoot.querySelectorAll('d2l-input-date-time')[inputNum];
		const dateInput = input.shadowRoot.querySelector('d2l-input-date');
		const content = dateInput.shadowRoot.querySelector('[dropdown-content]');
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
	}, inputNum);
}

describe('d2l-input-date-time-range', () => {

	const visualDiff = new VisualDiff('input-date-time-range', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser, { viewport: { width: 800, height: 3600 } });
		await page.goto(`${visualDiff.getBaseUrl()}/components/inputs/test/input-date-time-range.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();

		// #opened being opened causes issues with focus with other date-time inputs being opened.
		// Putting this first in case tests are run in isolation.
		await page.$eval('#opened', (elem) => elem.removeAttribute('start-opened'));
	});

	after(async() => await browser.close());

	[
		'basic',
		'disabled',
		'invalid-start-value',
		'hidden-labels',
		'hidden-labels-values',
		'labelled',
		'label-hidden',
		'localized',
		'required',
		'slotted-content',
		'start-end-label',
		'start-end-value',
		'start-value',
		'wide-basic',
		'wide-hidden-labels-values',
		'wide-start-end-value'
	].forEach((name) => {
		it(name, async function() {
			const rect = await visualDiff.getRect(page, `#${name}`);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

	it('basic-focus', async function() {
		setTimeout(() => focusWithKeyboard(page, '#basic'));
		await page.$eval('#basic', (elem) => {
			return new Promise((resolve) => {
				elem.blur(); // Reset focus
				elem.addEventListener('d2l-tooltip-show', resolve, { once: true });
			});
		});
		const rect = await visualDiff.getRect(page, '#basic');
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
			const rect = await visualDiff.getRect(page, '#start-end-value');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

	describe('opened behavior', () => {

		before(async() => {
			await page.reload();
			await page.$eval('#opened', async(elem) => await elem.updateComplete);
		});

		after(async() => {
			await page.$eval('#opened', (elem) => elem.endOpened = false);
		});

		beforeEach(async() => {
			await page.$eval('#opened', async(elem) => {
				if (!elem.getAttribute('start-opened')) {
					elem.setAttribute('start-opened', true);
					await elem.updateComplete;
				}
			});
		});

		it('intially start opened', async function() {
			const rect = await getRect(page, '#opened', 0);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('end opened', async function() {
			await page.$eval('#opened', async(elem) => {
				elem.removeAttribute('start-opened');
				elem.endOpened = true;
				await elem.updateComplete;
			});
			const rect = await getRect(page, '#opened', 1);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
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

		async function changeInnerInputTextDate(page, selector, inputSelector, date, waitForTime) {
			return page.$eval(selector, (elem, inputSelector, date, waitForTime) => {
				const dateElem = elem.shadowRoot.querySelector(inputSelector);
				const innerInput = dateElem.shadowRoot.querySelector('d2l-input-date');
				innerInput.value = date;
				const e = new Event(
					'change',
					{ bubbles: true, composed: false }
				);
				innerInput.dispatchEvent(e);
				if (waitForTime) {
					return new Promise((resolve) => {
						elem.updateComplete.then(() => {
							const timeElem = dateElem.shadowRoot.querySelector('d2l-input-time');
							timeElem.addEventListener('d2l-input-time-hidden-content-width-change', () => timeElem.updateComplete.then(resolve));
						});
					});
				}
			}, inputSelector, date, waitForTime);
		}

		async function changeInnerInputDateTime(page, selector, inputSelector, date, waitForTime) {
			return page.$eval(selector, (elem, inputSelector, date, waitForTime) => {
				const dateElem = elem.shadowRoot.querySelector(inputSelector);
				if (dateElem.value.substring(0, 23) === date.substring(0, 23)) return; // Needed for retries
				dateElem.value = date;
				const e = new Event(
					'change',
					{ bubbles: true, composed: false }
				);
				dateElem.dispatchEvent(e);
				if (waitForTime) {
					return new Promise((resolve) => {
						elem.updateComplete.then(() => {
							const timeElem = dateElem.shadowRoot.querySelector('d2l-input-time');
							timeElem.addEventListener('d2l-input-time-hidden-content-width-change', () => timeElem.updateComplete.then(setTimeout(resolve, 100)));
						});
					});
				}
			}, inputSelector, date, waitForTime);
		}

		// Needed for retries
		async function setupStartingValues(page, selector, expectedStart, expectedEnd) {
			await changeInnerInputDateTime(page, selector, startDateSelector, expectedStart);
			await changeInnerInputDateTime(page, selector, endDateSelector, expectedEnd);
		}

		it('start equals end when inclusive', async function() {
			await changeInnerInputTextDate(page, '#inclusive', endDateSelector, ''); // Reset width change event
			await changeInnerInputTextDate(page, '#inclusive', startDateSelector, dateInRange);
			await changeInnerInputTextDate(page, '#inclusive', endDateSelector, dateInRange, true);

			const rect = await visualDiff.getRect(page, '#inclusive');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		describe('autoShiftDates', () => {
			[
				{ name: 'localized', id: '#localized', maxValueTime: '22:00:00' },
				{ name: 'not localized', id: '#auto-shift-dates', maxValueTime: '2020-12-06T03:00:00.000Z' }
			].forEach((testCase) => {
				// start-value: 2020-12-02T06:00:00.000Z
				// end-value: 2021-12-04T10:30:00.000Z
				describe(testCase.name, () => {
					it('change start date', async function() {
						await setupStartingValues(page, testCase.id, '2020-12-02T06:00:00.000Z', '2021-12-04T10:30:00.000Z');
						await changeInnerInputDateTime(page, testCase.id, startDateSelector, '2020-12-05T06:00:00.000Z');

						const rect = await visualDiff.getRect(page, testCase.id);
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
					});

					it('change start time', async function() {
						await setupStartingValues(page, testCase.id, '2020-12-05T06:00:00.000Z', '2021-12-07T10:30:00.000Z');
						await changeInnerInputDateTime(page, testCase.id, endDateSelector, '2020-12-05T10:30:00.000Z');
						await changeInnerInputDateTime(page, testCase.id, startDateSelector, '2020-12-05T15:00:00.000Z');

						const rect = await visualDiff.getRect(page, testCase.id);
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
					});

					it('change start date when dates same', async function() {
						await setupStartingValues(page, testCase.id, '2020-12-05T15:00:00.000Z', '2020-12-05T19:30:00.000Z');
						await changeInnerInputDateTime(page, testCase.id, startDateSelector, '2020-12-13T15:00:00.000Z');

						const rect = await visualDiff.getRect(page, testCase.id);
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
					});

					it('change start time to cause max value to be reached', async function() {
						await setupStartingValues(page, testCase.id, '2020-12-13T15:00:00.000Z', '2020-12-13T19:30:00.000Z');
						await page.$eval(testCase.id, (elem, inputSelector) => {
							const dateElem = elem.shadowRoot.querySelector(inputSelector);
							const innerInput = dateElem.shadowRoot.querySelector('d2l-input-time');
							innerInput.value = '22:00:00';
							const e = new Event(
								'change',
								{ bubbles: true, composed: false }
							);
							innerInput.dispatchEvent(e);
						}, startDateSelector);

						const rect = await visualDiff.getRect(page, testCase.id);
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
					});
				});
			});
		});

		describe('bad input', () => {

			describe('function', () => {
				after(async() => {
					await page.$eval('#min-max', (elem) => elem.startOpened = false);
				});

				beforeEach(async() => {
					await visualDiff.resetFocus(page);
				});

				it('open', async function() {
					await page.$eval('#min-max', (elem) => {
						elem.blur();
						elem.shadowRoot.querySelector('d2l-input-date-time').shadowRoot.querySelector('d2l-input-date')._handleFirstDropdownOpen();
					});
					await changeInnerInputTextDate(page, '#min-max', startDateSelector, dateLaterInRange);
					await changeInnerInputTextDate(page, '#min-max', endDateSelector, dateInRange);

					await page.$eval('#min-max', (elem) => {
						const input = elem.shadowRoot.querySelector('d2l-input-date-time');
						const input2 = input.shadowRoot.querySelector('d2l-input-date');
						const input3 = input2.shadowRoot.querySelector('d2l-input-text');
						const eventObj = document.createEvent('Events');
						eventObj.initEvent('keydown', true, true);
						eventObj.keyCode = 13;
						input3.dispatchEvent(eventObj);
					});

					const rect = await page.$eval('#min-max', (elem) => {
						const input = elem.shadowRoot.querySelector('d2l-input-date-time');
						const input2 = input.shadowRoot.querySelector('d2l-input-date');
						const content = input2.shadowRoot.querySelector('[dropdown-content]');
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
						await changeInnerInputDateTime(page, '#min-max', startDateSelector, testCase.startDate);
						await changeInnerInputDateTime(page, '#min-max', endDateSelector, testCase.endDate);
					});

					it('basic', async function() {
						const rect = await visualDiff.getRect(page, '#min-max');
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
					});

					it('focus start', async function() {
						await focusOnInput(page, '#min-max', startDateSelector);
						const rect = await getRectTooltip(page, '#min-max');
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
					});

					it('focus end', async function() {
						await focusOnInput(page, '#min-max', endDateSelector);
						const rect = await getRectTooltip(page, '#min-max', 1);
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
					});
				});
			});
		});

		describe('outside range', () => {
			[
				{ name: 'start before min', startDate: dateBeforeMin, endDate: dateInRange, startDateTooltip: true, endDateTooltip: false },
				{ name: 'end after max', startDate: dateInRange, endDate: dateAfterMax, startDateTooltip: false, endDateTooltip: true }
			].forEach((testCase) => {
				describe(testCase.name, () => {
					before(async() => {
						await changeInnerInputTextDate(page, '#min-max', startDateSelector, '');
						await changeInnerInputTextDate(page, '#min-max', endDateSelector, '');
						await changeInnerInputTextDate(page, '#min-max', startDateSelector, testCase.startDate, true);
						await changeInnerInputTextDate(page, '#min-max', endDateSelector, testCase.endDate, true);
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
						const rect = testCase.startDateTooltip
							? await getRectInnerTooltip(page, '#min-max', startDateSelector)
							: await visualDiff.getRect(page, '#min-max');
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
					});

					it('focus end', async function() {
						await focusOnInput(page, '#min-max', endDateSelector);
						const rect = testCase.endDateTooltip
							? await getRectInnerTooltip(page, '#min-max', endDateSelector)
							: await visualDiff.getRect(page, '#min-max');
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

	});

	describe('skeleton', () => {

		[
			'labelled',
			'label-hidden',
			'hidden-labels-values',
			'wide-hidden-labels-values'
		].forEach((name) => {
			after(async() => {
				await page.$eval(`#${name}`, (elem) => elem.skeleton = false);
			});

			it(name, async function() {
				await page.$eval(`#${name}`, (elem) => elem.skeleton = true);
				const rect = await visualDiff.getRect(page, `#${name}`);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});
		});
	});

	describe('width change', () => {
		it('resizes correctly when width increased', async function() {
			const rect = await page.$eval('#hidden-labels', async(elem) => {
				elem.style.maxWidth = '800px';
				elem.parentNode.style.width = '800px';
				await elem.updateComplete;
				const margin = 10;
				const leftMargin = (elem.offsetLeft < margin ? 0 : margin);
				const topMargin = (elem.offsetTop < margin ? 0 : margin);
				return {
					x: elem.offsetLeft - leftMargin,
					y: elem.offsetTop - topMargin,
					width: 400,
					height: 90
				};
			});
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('resizes correctly when width decreased', async function() {
			const rect = await page.$eval('#wide-hidden-labels-values', async(elem) => {
				elem.parentNode.style.width = '350px';
				await elem.updateComplete;
				const margin = 10;
				const leftMargin = (elem.offsetLeft < margin ? 0 : margin);
				const topMargin = (elem.offsetTop < margin ? 0 : margin);
				return {
					x: elem.offsetLeft - leftMargin,
					y: elem.offsetTop - topMargin,
					width: 350,
					height: 175
				};
			});
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('resizes correctly when width decreased further', async function() {
			const rect = await page.$eval('#wide-hidden-labels-values', async(elem) => {
				elem.parentNode.style.width = '250px';
				await elem.updateComplete;
				const margin = 10;
				const leftMargin = (elem.offsetLeft < margin ? 0 : margin);
				const topMargin = (elem.offsetTop < margin ? 0 : margin);
				return {
					x: elem.offsetLeft - leftMargin,
					y: elem.offsetTop - topMargin,
					width: 300,
					height: 300
				};
			});
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

});
