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

	after(() => browser.close());

	it('has no selected-value when selected-value not set', async function() {
		const rect = await visualDiff.getRect(page, '#no-selected');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('month with first row entirely current month days and last row containing next month days', async function() {
		const rect = await visualDiff.getRect(page, '#dec-2019');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	describe('style', () => {
		afterEach(async() => {
			await page.reload();
		});

		it('has correct style when today selected', async function() {
			const rect = await visualDiff.getRect(page, '#today-selected');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('has correct hover style on non-selected-value', async function() {
			await page.$eval(firstCalendarOfPage, (calendar) => {
				const date = calendar.shadowRoot.querySelector('div[data-date="20"]');
				date.classList.add('d2l-calendar-date-hover');
			});
			const rect = await visualDiff.getRect(page, firstCalendarOfPage);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('has correct hover style on selected-value', async function() {
			await page.$eval(firstCalendarOfPage, (calendar) => {
				const date = calendar.shadowRoot.querySelector('div[data-date="14"]');
				date.classList.add('d2l-calendar-date-hover');
			});
			const rect = await visualDiff.getRect(page, firstCalendarOfPage);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('has correct focus style on non-selected-value', async function() {
			let date;
			await page.$eval(firstCalendarOfPage, (calendar) => {
				date = calendar.shadowRoot.querySelector('div[data-date="20"]');
				date.focus();
			});
			const rect = await visualDiff.getRect(page, firstCalendarOfPage);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('has correct focus style on selected-value', async function() {
			let date;
			await page.$eval(firstCalendarOfPage, (calendar) => {
				date = calendar.shadowRoot.querySelector('div[data-date="14"]');
				date.focus();
			});
			const rect = await visualDiff.getRect(page, firstCalendarOfPage);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('has correct hover and focus style on non-selected-value', async function() {
			let date;
			await page.$eval(firstCalendarOfPage, (calendar) => {
				date = calendar.shadowRoot.querySelector('div[data-date="20"]');
				date.classList.add('d2l-calendar-date-hover');
				date.focus();
			});
			const rect = await visualDiff.getRect(page, firstCalendarOfPage);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('has correct hover and focus style on selected-value', async function() {
			let date;
			await page.$eval(firstCalendarOfPage, (calendar) => {
				date = calendar.shadowRoot.querySelector('div[data-date="14"]');
				date.classList.add('d2l-calendar-date-hover');
				date.focus();
			});
			const rect = await visualDiff.getRect(page, firstCalendarOfPage);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

	describe('selection', () => {
		afterEach(async() => {
			await page.reload();
		});

		it('selects a new date by clicking on it', async function() {
			await page.$eval(firstCalendarOfPage, (calendar) => {
				const date = calendar.shadowRoot.querySelector('div[data-date="20"]');
				date.click();
			});
			const rect = await visualDiff.getRect(page, firstCalendarOfPage);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('selects a new date by pressing enter on it', async function() {
			await tabToDates();
			await page.keyboard.press('ArrowRight');
			await page.keyboard.press('Enter');
			await page.keyboard.press('ArrowRight');
			const rect = await visualDiff.getRect(page, firstCalendarOfPage);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('selects a new date by pressing space on it', async function() {
			await tabToDates();
			await page.keyboard.press('ArrowRight');
			await page.keyboard.press('Space');
			await page.keyboard.press('ArrowRight');
			const rect = await visualDiff.getRect(page, firstCalendarOfPage);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

	describe('navigation', () => {
		afterEach(async() => {
			await page.reload();
		});

		it('navigates to the previous month when clicking the left arrow', async function() {
			await page.$eval('#contains-today-diff-selected', (calendar) => {
				const arrow = calendar.shadowRoot.querySelector('d2l-button-icon[text="Show January"]');
				arrow.click();
			});
			const rect = await visualDiff.getRect(page, '#contains-today-diff-selected');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('navigates to next month when clicking on the right arrow', async function() {
			await page.$eval('#dec-2019', (calendar) => {
				const arrow = calendar.shadowRoot.querySelector('d2l-button-icon[text="Show January"]');
				arrow.click();
			});
			const rect = await visualDiff.getRect(page, '#dec-2019');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		describe('arrow key navigation of dates', () => {
			it('starts from focus date on selected dates month', async function() {
				await tabToDates();
				const rect = await visualDiff.getRect(page, firstCalendarOfPage);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it('starts from 1st of month on month that does not contain selected value', async function() {
				await page.$eval(firstCalendarOfPage, (calendar) => {
					const arrow = calendar.shadowRoot.querySelector('d2l-button-icon[text="Show March"]');
					arrow.click();
				});
				await tabToDates();
				const rect = await visualDiff.getRect(page, firstCalendarOfPage);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it('navigates to previous month when up arrow pressed enough times', async function() {
				await tabToDates();
				await page.keyboard.press('ArrowUp');
				await page.keyboard.press('ArrowUp');
				await page.keyboard.press('ArrowUp');
				const rect = await visualDiff.getRect(page, firstCalendarOfPage);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it('navigates to previous month when left arrow pressed enough times', async function() {
				await tabToDates();
				for (let i = 0; i < 18; i++) {
					await page.keyboard.press('ArrowLeft');
				}
				const rect = await visualDiff.getRect(page, firstCalendarOfPage);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it('navigates to next month when down arrow pressed enough times', async function() {
				await tabToDates();
				await page.keyboard.press('ArrowDown');
				await page.keyboard.press('ArrowDown');
				await page.keyboard.press('ArrowDown');
				const rect = await visualDiff.getRect(page, firstCalendarOfPage);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it('navigates to next month when right arrow pressed enough times', async function() {
				await tabToDates();
				for (let i = 0; i < 18; i++) {
					await page.keyboard.press('ArrowRight');
				}
				const rect = await visualDiff.getRect(page, firstCalendarOfPage);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});
		});

		describe('other key navigation', () => {
			// the selected day is the monday with first day of week sunday
			it('navigates to the end of the week when END key pressed', async function() {
				await tabToDates();
				await page.keyboard.press('End');
				const rect = await visualDiff.getRect(page, firstCalendarOfPage);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it('navigates to the start of the week when HOME key pressed', async function() {
				await tabToDates();
				await page.keyboard.press('Home');
				const rect = await visualDiff.getRect(page, firstCalendarOfPage);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it('navigates to first week in next month when PAGEDOWN pressed from month with more weeks in current month than next', async function() {
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

			it('navigates to last week in previous month when PAGEUP pressed from month with more weeks in current month than next', async function() {
				await page.$eval(firstCalendarOfPage, (calendar) => {
					const arrow1 = calendar.shadowRoot.querySelector('d2l-button-icon[text="Show January"]');
					arrow1.click();
					const arrow2 = calendar.shadowRoot.querySelector('d2l-button-icon');
					arrow2.click();
				});

				await page.$eval(firstCalendarOfPage, (calendar) => {
					const date = calendar.shadowRoot.querySelector('div[data-date="3"][data-month="0"]');
					date.click();
				});

				await tabToDates();
				await page.keyboard.press('PageUp');

				const rect = await visualDiff.getRect(page, firstCalendarOfPage);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

		});
	});

	const tabToDates = async function() {
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');
	};

});
