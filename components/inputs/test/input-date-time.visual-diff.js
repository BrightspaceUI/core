const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-input-date-time', () => {

	const visualDiff = new VisualDiff('input-date-time', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await browser.newPage();
		await page.setViewport({width: 800, height: 900, deviceScaleFactor: 2});
		await page.goto(`${visualDiff.getBaseUrl()}/components/inputs/test/input-date-time.visual-diff.html`, {waitUntil: ['networkidle0', 'load']});
		await page.bringToFront();
	});

	after(() => browser.close());

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

});
