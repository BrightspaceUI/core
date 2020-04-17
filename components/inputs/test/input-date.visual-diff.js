const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');
const helper = require('./input-helper.js');

describe('d2l-input-date', () => {

	const visualDiff = new VisualDiff('input-date', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);
		await page.setViewport({width: 800, height: 900, deviceScaleFactor: 2});
		await page.goto(`${visualDiff.getBaseUrl()}/components/inputs/test/input-date.visual-diff.html`, {waitUntil: ['networkidle0', 'load']});
		await page.bringToFront();
	});

	after(async() => await browser.close());

	[
		'basic',
		'disabled',
		'labelled',
		'label-hidden',
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

	describe('calendar dropdown', () => {
		before(async() => {
			await page.reload();
		});

		afterEach(async() => {
			await helper.reset(page, '#basic');
		});

		it('disabled does not open', async function() {
			await page.$eval('#disabled', (elem) => {
				const input = elem.shadowRoot.querySelector('d2l-input-text');
				const e = new Event(
					'mouseup',
					{ bubbles: true, composed: true }
				);
				input.dispatchEvent(e);
			});
			const rect = await helper.getRect(page, '#disabled');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('open with value', async function() {
			await helper.open(page, '#basic');
			const rect = await helper.getRect(page, '#basic');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('tab on open', async function() {
			await helper.open(page, '#basic');
			await page.keyboard.press('Tab');
			const rect = await helper.getRect(page, '#basic');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('click date', async function() {
			await helper.open(page, '#basic');
			await page.$eval('#basic', (elem) => {
				const calendar = elem.shadowRoot.querySelector('d2l-calendar');
				const date = calendar.shadowRoot.querySelector('td[data-date="20"]');
				date.click();
			});
			const rect = await visualDiff.getRect(page, '#basic');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('set to today', async function() {
			await page.$eval('#basic', (elem) => {
				const button = elem.shadowRoot.querySelector('d2l-button-subtle[text="Set to Today"]');
				button.click();
			});
			const rect = await visualDiff.getRect(page, '#basic');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('clear', async function() {
			await page.$eval('#basic', (elem) => {
				const button = elem.shadowRoot.querySelector('d2l-button-subtle[text="Clear"]');
				button.click();
			});
			const rect = await visualDiff.getRect(page, '#basic');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('opens then changes month then closes then reopens', async function() {
			// open
			await helper.open(page, '#basic');

			// change month
			await page.$eval('#basic', (elem) => {
				return new Promise((resolve) => {
					const calendar = elem.shadowRoot.querySelector('d2l-calendar');
					calendar.addEventListener('d2l-calendar-show-month-complete', resolve, { once: true });
					const button = calendar.shadowRoot.querySelector('d2l-button-icon[text="Show March"]');
					button.click();
				});
			});

			// close
			await helper.reset(page, '#basic');

			// re-open
			await helper.open(page, '#basic');

			const rect = await helper.getRect(page, '#basic');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('open with placeholder', async function() {
			await helper.open(page, '#no-value');
			const rect = await helper.getRect(page, '#no-value');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

});
