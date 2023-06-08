import { focusWithKeyboard, VisualDiff } from '@brightspace-ui/visual-diff';
import puppeteer from 'puppeteer';

describe('d2l-calendar', () => {

	const visualDiff = new VisualDiff('calendar', import.meta.url);

	let browser, page;

	const firstCalendarOfPage = '#contains-today-diff-selected';

	const tabToDates = async function() {
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');
	};

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser, { viewport: { width: 400, height: 2800 } });
		await page.goto(`${visualDiff.getBaseUrl()}/components/calendar/test/calendar.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	after(async() => await browser.close());

	[
		'dec-2019', // first row only current month days last row contains next month days
		'max',
		'min',
		'min-max',
		'min-max-no-selected',
		'no-selected',
		'today-selected'
	].forEach((name) => {
		it(name, async function() {
			const rect = await visualDiff.getRect(page, `#${name}`);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

	describe('localization', () => {

		after(async() => {
			await page.evaluate(() => document.querySelector('html').setAttribute('lang', 'en'));
		});

		[
			'ar',
			'da',
			'de',
			'en',
			'es',
			'fr',
			'ja',
			'ko',
			'nl',
			'pt',
			'sv',
			'tr',
			'zh',
			'zh-tw'
		].forEach((lang) => {
			it(`${lang}`, async function() {
				await page.evaluate((lang, firstCalendarOfPage) => {
					const calendar = document.querySelector(firstCalendarOfPage);
					return new Promise((resolve) => {
						if (document.querySelector('html').getAttribute('lang') !== lang) { // Needed for retries
							calendar.addEventListener('d2l-localize-resources-change', resolve, { once: true });
							document.querySelector('html').setAttribute('lang', lang);
						} else {
							resolve();
						}
					});
				}, lang, firstCalendarOfPage);
				const rect = await visualDiff.getRect(page, firstCalendarOfPage);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});
		});
	});

	describe('style', () => {
		afterEach(async() => {
			await page.reload();
		});

		it('focus', async function() {
			await focusWithKeyboard(page, firstCalendarOfPage);
			const rect = await visualDiff.getRect(page, firstCalendarOfPage);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		describe('date', () => {
			it('hover on non-selected-value', async function() {
				await page.$eval(firstCalendarOfPage, (calendar) => {
					const date = calendar.shadowRoot.querySelector('td[data-date="20"] button');
					date.classList.add('d2l-calendar-date-hover');
				});
				const rect = await visualDiff.getRect(page, firstCalendarOfPage);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it('hover on selected-value', async function() {
				await page.$eval(firstCalendarOfPage, (calendar) => {
					const date = calendar.shadowRoot.querySelector('td[data-date="14"] button');
					date.classList.add('d2l-calendar-date-hover');
				});
				const rect = await visualDiff.getRect(page, firstCalendarOfPage);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it('focus on non-selected-value', async function() {
				await focusWithKeyboard(page, [firstCalendarOfPage, 'td[data-date="20"]']);
				const rect = await visualDiff.getRect(page, firstCalendarOfPage);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it('focus on selected-value', async function() {
				await focusWithKeyboard(page, [firstCalendarOfPage, 'td[data-date="14"]']);
				const rect = await visualDiff.getRect(page, firstCalendarOfPage);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it('hover and focus on non-selected-value', async function() {
				await page.$eval(firstCalendarOfPage, (calendar) => {
					const date = calendar.shadowRoot.querySelector('td[data-date="20"] button');
					date.classList.add('d2l-calendar-date-hover');
				});
				await focusWithKeyboard(page, [firstCalendarOfPage, 'td[data-date="20"]']);
				const rect = await visualDiff.getRect(page, firstCalendarOfPage);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it('hover and focus on selected-value', async function() {
				let date;
				await page.$eval(firstCalendarOfPage, async(calendar) => {
					date = calendar.shadowRoot.querySelector('td[data-date="14"] button');
					date.classList.add('d2l-calendar-date-hover');
				});
				await focusWithKeyboard(page, [firstCalendarOfPage, 'td[data-date="14"]']);
				const rect = await visualDiff.getRect(page, firstCalendarOfPage);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});
		});
	});

	describe('interaction', () => {
		afterEach(async function() {
			let opts = {
				calendar: firstCalendarOfPage,
				selected: '2018-02-14',
				focus: true
			};
			const testOpts = this.currentTest.value;
			if (testOpts) opts = Object.assign(opts, testOpts);

			await page.$eval(opts.calendar, async(calendar, selected) => {
				calendar.selectedValue = selected;
				await calendar.reset();
			}, opts.selected);
			if (opts.focus) {
				await focusWithKeyboard(page, opts.calendar);
			} else {
				await visualDiff.resetFocus(page);
			}
		});

		it('click left arrow', async function() {
			this.test.value = { focus: false }; // Needed for retries
			await page.$eval(firstCalendarOfPage, (calendar) => {
				const arrow = calendar.shadowRoot.querySelector('d2l-button-icon[text="Show January"]');
				arrow.click();
			});
			const rect = await visualDiff.getRect(page, firstCalendarOfPage);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('click right arrow', async function() {
			this.test.value = { calendar: '#dec-2019', selected: '2019-12-01', focus: false }; // Needed for retries
			await page.$eval('#dec-2019', (calendar) => {
				const arrow = calendar.shadowRoot.querySelector('d2l-button-icon[text="Show January"]');
				arrow.click();
			});
			const rect = await visualDiff.getRect(page, '#dec-2019');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('initial focus date is selected-value', async function() {
			await tabToDates();
			const rect = await visualDiff.getRect(page, firstCalendarOfPage);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('initial focus date is 1st of month', async function() {
			await page.$eval(firstCalendarOfPage, async(calendar) => {
				const arrow = calendar.shadowRoot.querySelector('d2l-button-icon[text="Show March"]');
				arrow.click();
			});
			await tabToDates();
			const rect = await visualDiff.getRect(page, firstCalendarOfPage);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		describe('date selection', () => {
			it('click', async function() {
				await page.$eval(firstCalendarOfPage, (calendar) => {
					const date = calendar.shadowRoot.querySelector('td[data-date="20"] button');
					date.click();
				});
				const rect = await visualDiff.getRect(page, firstCalendarOfPage);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it('click disabled', async function() {
				this.test.value = { calendar: '#min-max' }; // Needed for retries
				await page.$eval('#min-max', (calendar) => {
					const dateFocusable = calendar.shadowRoot.querySelector('td[data-date="1"] button');
					dateFocusable.click();
					const dateDisabled = calendar.shadowRoot.querySelector('td[data-date="30"] button');
					dateDisabled.click();
				});
				const rect = await visualDiff.getRect(page, '#min-max');
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it('enter', async function() {
				await tabToDates();
				await page.keyboard.press('ArrowRight');
				await page.keyboard.press('Enter');
				await page.keyboard.press('ArrowRight');
				const rect = await visualDiff.getRect(page, firstCalendarOfPage);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it('space', async function() {
				await tabToDates();
				await page.keyboard.press('ArrowRight');
				await page.keyboard.press('Space');
				await page.keyboard.press('ArrowRight');
				const rect = await visualDiff.getRect(page, firstCalendarOfPage);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});
		});

		describe('keys', () => {
			describe('arrow', () => {
				it('up to prev month', async function() {
					await tabToDates();
					await page.keyboard.press('ArrowUp');
					await page.keyboard.press('ArrowUp');
					await page.keyboard.press('ArrowUp');
					const rect = await visualDiff.getRect(page, firstCalendarOfPage);
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});

				it('left to prev month', async function() {
					await tabToDates();
					for (let i = 0; i < 18; i++) {
						await page.keyboard.press('ArrowLeft');
					}
					const rect = await visualDiff.getRect(page, firstCalendarOfPage);
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});

				it('down to next month', async function() {
					await tabToDates();
					await page.keyboard.press('ArrowDown');
					await page.keyboard.press('ArrowDown');
					await page.keyboard.press('ArrowDown');
					const rect = await visualDiff.getRect(page, firstCalendarOfPage);
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});

				it('right to next month', async function() {
					await tabToDates();
					for (let i = 0; i < 18; i++) {
						await page.keyboard.press('ArrowRight');
					}
					const rect = await visualDiff.getRect(page, firstCalendarOfPage);
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});
			});

			describe('other', () => {
				it('END', async function() {
					await tabToDates();
					await page.keyboard.press('End');
					const rect = await visualDiff.getRect(page, firstCalendarOfPage);
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});

				it('HOME', async function() {
					await tabToDates();
					await page.keyboard.press('Home');
					const rect = await visualDiff.getRect(page, firstCalendarOfPage);
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});

				it('PAGEDOWN', async function() {
					await page.$eval(firstCalendarOfPage, (calendar) => {
						const arrow1 = calendar.shadowRoot.querySelector('d2l-button-icon[text="Show January"]');
						arrow1.click();
						const arrow2 = calendar.shadowRoot.querySelector('d2l-button-icon');
						arrow2.click();
					});
					await tabToDates();
					await page.keyboard.press('PageDown');

					const rect = await visualDiff.getRect(page, firstCalendarOfPage);
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});

				it('PAGEUP', async function() {
					await page.$eval(firstCalendarOfPage, (calendar) => {
						const arrow1 = calendar.shadowRoot.querySelector('d2l-button-icon[text="Show January"]');
						arrow1.click();
						const arrow2 = calendar.shadowRoot.querySelector('d2l-button-icon');
						arrow2.click();
					});

					await page.$eval(firstCalendarOfPage, (calendar) => {
						const date = calendar.shadowRoot.querySelector('td[data-date="3"][data-month="0"] button');
						date.click();
					});

					await page.keyboard.press('PageUp');

					const rect = await visualDiff.getRect(page, firstCalendarOfPage);
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});

				describe('min-max', () => {
					afterEach(async() => {
						await page.$eval('#min-max', async(calendar) => {
							calendar.selectedValue = '2018-02-14';
							await calendar.reset();
						});
						await focusWithKeyboard(page, '#min-max');
					});

					it('HOME min value', async function() {
						await page.$eval('#min-max', (calendar) => {
							const date = calendar.shadowRoot.querySelector('td[data-date="2"][data-month="1"] button');
							date.click();
						});

						await page.$eval('#min-max', (calendar) => {
							const date = calendar.shadowRoot.querySelector('td[data-date="2"][data-month="1"]');
							const eventObj = document.createEvent('Events');
							eventObj.initEvent('keydown', true, true);
							eventObj.keyCode = 36;
							date.dispatchEvent(eventObj);
						});
						const rect = await visualDiff.getRect(page, '#min-max');
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
					});

					it('END max value', async function() {
						await page.$eval('#min-max', (calendar) => {
							const date = calendar.shadowRoot.querySelector('td[data-date="26"][data-month="1"] button');
							date.click();
						});

						await page.$eval('#min-max', (calendar) => {
							const date = calendar.shadowRoot.querySelector('td[data-date="26"][data-month="1"]');
							const eventObj = document.createEvent('Events');
							eventObj.initEvent('keydown', true, true);
							eventObj.keyCode = 35;
							date.dispatchEvent(eventObj);
						});

						const rect = await visualDiff.getRect(page, '#min-max');
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
					});

					it('PAGEDOWN max value', async function() {
						await page.$eval('#min-max', (calendar) => {
							const date = calendar.shadowRoot.querySelector('td[data-date="17"]');
							const eventObj = document.createEvent('Events');
							eventObj.initEvent('keydown', true, true);
							eventObj.keyCode = 34;
							date.dispatchEvent(eventObj);
						});
						const rect = await visualDiff.getRect(page, '#min-max');
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
					});

					it('PAGEDOWN twice max value', async function() {
						await page.$eval('#min-max', (calendar) => {
							const date = calendar.shadowRoot.querySelector('td[data-date="17"]');
							const eventObj = document.createEvent('Events');
							eventObj.initEvent('keydown', true, true);
							eventObj.keyCode = 34;
							date.dispatchEvent(eventObj);
							date.dispatchEvent(eventObj);
						});
						const rect = await visualDiff.getRect(page, '#min-max');
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
					});

					it('PAGEUP min value', async function() {
						await page.$eval('#min-max', (calendar) => {
							const date = calendar.shadowRoot.querySelector('td[data-date="17"]');
							const eventObj = document.createEvent('Events');
							eventObj.initEvent('keydown', true, true);
							eventObj.keyCode = 33;
							date.dispatchEvent(eventObj);
						});
						const rect = await visualDiff.getRect(page, '#min-max');
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
					});

					it('PAGEUP twice min value', async function() {
						await page.$eval('#min-max', (calendar) => {
							const date = calendar.shadowRoot.querySelector('td[data-date="17"]');
							const eventObj = document.createEvent('Events');
							eventObj.initEvent('keydown', true, true);
							eventObj.keyCode = 33;
							date.dispatchEvent(eventObj);
							date.dispatchEvent(eventObj);
						});
						const rect = await visualDiff.getRect(page, '#min-max');
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
					});

				});
			});
		});
	});
});
