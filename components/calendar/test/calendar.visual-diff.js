const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-calendar', () => {

	const visualDiff = new VisualDiff('calendar', __dirname);

	let browser, page;

	const firstCalendarOfPage = '#contains-today-diff-selected';

	before(async() => {
		browser = await puppeteer.launch();
		page = await browser.newPage();
		await page.setViewport({width: 400, height: 1600, deviceScaleFactor: 2});
		await page.goto(`${visualDiff.getBaseUrl()}/components/calendar/test/calendar.visual-diff.html`, {waitUntil: ['networkidle0', 'load']});
		await page.bringToFront();
	});

	after(async() => await browser.close());

	it('no selected value', async function() {
		const rect = await visualDiff.getRect(page, '#no-selected');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('first row only current month days last row contains next month days', async function() {
		const rect = await visualDiff.getRect(page, '#dec-2019');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
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
				await page.evaluate(lang => document.querySelector('html').setAttribute('lang', lang), lang);
				const rect = await visualDiff.getRect(page, firstCalendarOfPage);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});
		});
	});

	describe('style', () => {
		afterEach(async() => {
			await page.reload();
		});

		it('today selected', async function() {
			const rect = await visualDiff.getRect(page, '#today-selected');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('focus', async function() {
			await page.$eval(firstCalendarOfPage, (elem) => elem.focus());
			const rect = await visualDiff.getRect(page, firstCalendarOfPage);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		describe('date', () => {
			it('hover on non-selected-value', async function() {
				await page.$eval(firstCalendarOfPage, (calendar) => {
					const date = calendar.shadowRoot.querySelector('td[data-date="20"] div');
					date.classList.add('d2l-calendar-date-hover');
				});
				const rect = await visualDiff.getRect(page, firstCalendarOfPage);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it('hover on selected-value', async function() {
				await page.$eval(firstCalendarOfPage, (calendar) => {
					const date = calendar.shadowRoot.querySelector('td[data-date="14"] div');
					date.classList.add('d2l-calendar-date-hover');
				});
				const rect = await visualDiff.getRect(page, firstCalendarOfPage);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it('focus on non-selected-value', async function() {
				await page.$eval(firstCalendarOfPage, (calendar) => {
					const date = calendar.shadowRoot.querySelector('td[data-date="20"]');
					date.focus();
				});
				await dateChangeEvent(page, firstCalendarOfPage);
				const rect = await visualDiff.getRect(page, firstCalendarOfPage);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it('focus on selected-value', async function() {
				await page.$eval(firstCalendarOfPage, (calendar) => {
					const date = calendar.shadowRoot.querySelector('td[data-date="14"]');
					date.focus();
				});
				await dateChangeEvent(page, firstCalendarOfPage);
				const rect = await visualDiff.getRect(page, firstCalendarOfPage);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it('hover and focus on non-selected-value', async function() {
				await page.$eval(firstCalendarOfPage, (calendar) => {
					const date = calendar.shadowRoot.querySelector('td[data-date="20"] div');
					date.classList.add('d2l-calendar-date-hover');
					const dateParent = date.parentNode;
					dateParent.focus();
				});
				const rect = await visualDiff.getRect(page, firstCalendarOfPage);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it('hover and focus on selected-value', async function() {
				let date;
				await page.$eval(firstCalendarOfPage, async(calendar) => {
					date = calendar.shadowRoot.querySelector('td[data-date="14"] div');
					const dateParent = date.parentNode;
					dateParent.focus();
				});
				await dateChangeEvent(page, firstCalendarOfPage);
				await page.$eval(firstCalendarOfPage, async() => {
					date.classList.add('d2l-calendar-date-hover');
				});
				const rect = await visualDiff.getRect(page, firstCalendarOfPage);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});
		});
	});

	describe('interaction', () => {
		afterEach(async() => {
			await page.reload();
		});

		it('click left arrow', async function() {
			await page.$eval('#contains-today-diff-selected', (calendar) => {
				const arrow = calendar.shadowRoot.querySelector('d2l-button-icon[text="Show January"]');
				arrow.click();
			});
			await monthChangeEvent(page, '#contains-today-diff-selected');
			const rect = await visualDiff.getRect(page, '#contains-today-diff-selected');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('click right arrow', async function() {
			await page.$eval('#dec-2019', (calendar) => {
				const arrow = calendar.shadowRoot.querySelector('d2l-button-icon[text="Show January"]');
				arrow.click();
			});
			await monthChangeEvent(page, '#dec-2019');
			const rect = await visualDiff.getRect(page, '#dec-2019');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('initial focus date is selected-value', async function() {
			await tabToDates();
			await dateChangeEvent(page, firstCalendarOfPage);
			const rect = await visualDiff.getRect(page, firstCalendarOfPage);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('initial focus date is 1st of month', async function() {
			await page.$eval(firstCalendarOfPage, (calendar) => {
				const arrow = calendar.shadowRoot.querySelector('d2l-button-icon[text="Show March"]');
				arrow.click();
			});
			await monthChangeEvent(page, firstCalendarOfPage);
			await tabToDates();
			await dateChangeEvent(page, firstCalendarOfPage);
			const rect = await visualDiff.getRect(page, firstCalendarOfPage);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		describe('date selection', () => {
			it('click', async function() {
				await page.$eval(firstCalendarOfPage, (calendar) => {
					const date = calendar.shadowRoot.querySelector('td[data-date="20"]');
					date.click();
				});
				const rect = await visualDiff.getRect(page, firstCalendarOfPage);
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
					await monthChangeEvent(page, firstCalendarOfPage);
					const rect = await visualDiff.getRect(page, firstCalendarOfPage);
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});

				it('left to prev month', async function() {
					await tabToDates();
					for (let i = 0; i < 18; i++) {
						await page.keyboard.press('ArrowLeft');
					}
					await monthChangeEvent(page, firstCalendarOfPage);
					const rect = await visualDiff.getRect(page, firstCalendarOfPage);
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});

				it('down to next month', async function() {
					await tabToDates();
					await page.keyboard.press('ArrowDown');
					await page.keyboard.press('ArrowDown');
					await page.keyboard.press('ArrowDown');
					await monthChangeEvent(page, firstCalendarOfPage);
					const rect = await visualDiff.getRect(page, firstCalendarOfPage);
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});

				it('right to next month', async function() {
					await tabToDates();
					for (let i = 0; i < 18; i++) {
						await page.keyboard.press('ArrowRight');
					}
					await monthChangeEvent(page, firstCalendarOfPage);
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
					await monthChangeEvent(page, firstCalendarOfPage);

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
						const date = calendar.shadowRoot.querySelector('td[data-date="3"][data-month="0"]');
						date.click();
					});

					await tabToDates();
					await page.keyboard.press('PageUp');
					await monthChangeEvent(page, firstCalendarOfPage);

					const rect = await visualDiff.getRect(page, firstCalendarOfPage);
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});
			});
		});
	});

	const monthChangeEvent = (page, selector) => {
		return page.$eval(selector, (elem) => {
			return new Promise((resolve) => {
				let opacityTransitioned, transformTransitioned;
				elem.shadowRoot.addEventListener('transitionend', (e) => {
					if (e.propertyName === 'opacity') opacityTransitioned = true;
					if (e.propertyName === 'transform') transformTransitioned = true;
					if (opacityTransitioned && transformTransitioned) resolve();
				});
			});
		});
	};

	const dateChangeEvent = (page, selector) => {
		return page.$eval(selector, (elem) => {
			return new Promise((resolve) => {
				elem.shadowRoot.addEventListener('transitionend', resolve, { once: true });
			});
		});
	};

	const tabToDates = async function() {
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');
	};

});
