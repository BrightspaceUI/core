const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-input-date-range', () => {

	const visualDiff = new VisualDiff('input-date-range', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await browser.newPage();
		await page.setViewport({width: 800, height: 900, deviceScaleFactor: 2});
		await page.goto(`${visualDiff.getBaseUrl()}/components/inputs/test/input-date-range.visual-diff.html`, {waitUntil: ['networkidle0', 'load']});
		await page.bringToFront();
	});

	after(async() => await browser.close());

	[
		'basic',
		'disabled',
		'invalid-start-value',
		'labelled',
		'label-hidden',
		'start-end-label',
		'start-end-label-long',
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

	describe('functionality', () => {

		before(async() => {
			await page.$eval('#basic', (elem) => elem.blur());
		});

		it('change start date', async function() {
			await page.$eval('#basic', (elem) => {
				const dateSelector = elem.shadowRoot.querySelector('d2l-input-date.d2l-input-date-range-start');
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

		it('change end date', async function() {
			await page.$eval('#basic', (elem) => {
				const dateSelector = elem.shadowRoot.querySelector('d2l-input-date.d2l-input-date-range-end');
				dateSelector.value = '2021-12-15';
				const e = new Event(
					'change',
					{ bubbles: true, composed: true }
				);
				dateSelector.dispatchEvent(e);
			});
			const rect = await visualDiff.getRect(page, '#basic');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('clear start date', async function() {
			await page.$eval('#basic', (elem) => {
				const dateSelector = elem.shadowRoot.querySelector('d2l-input-date.d2l-input-date-range-start');
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

		it('select start date after clear', async function() {
			await page.$eval('#basic', (elem) => {
				const dateSelector = elem.shadowRoot.querySelector('d2l-input-date.d2l-input-date-range-start');
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

		it.skip('change start date to be after end date', async function() {
			//TODO: enable after validation
			await page.$eval('#basic', (elem) => {
				const endDateSelector = elem.shadowRoot.querySelector('d2l-input-date.d2l-input-date-range-end');
				endDateSelector.value = '2020-12-15';
				const e = new Event(
					'change',
					{ bubbles: true, composed: true }
				);
				endDateSelector.dispatchEvent(e);

				const startDateSelector = elem.shadowRoot.querySelector('d2l-input-date.d2l-input-date-range-start');
				startDateSelector.value = '2021-12-15';
				const e2 = new Event(
					'change',
					{ bubbles: true, composed: true }
				);
				startDateSelector.dispatchEvent(e2);
			});
			const rect = await visualDiff.getRect(page, '#basic');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it.skip('change end date to be before start date', async function() {
			//TODO: enable after validation
			await page.$eval('#basic', (elem) => {
				const startDateSelector = elem.shadowRoot.querySelector('d2l-input-date.d2l-input-date-range-start');
				startDateSelector.value = '2021-12-15';
				const e = new Event(
					'change',
					{ bubbles: true, composed: true }
				);
				startDateSelector.dispatchEvent(e);

				const endDateSelector = elem.shadowRoot.querySelector('d2l-input-date.d2l-input-date-range-end');
				endDateSelector.value = '2020-12-15';
				const e2 = new Event(
					'change',
					{ bubbles: true, composed: true }
				);
				endDateSelector.dispatchEvent(e2);
			});
			const rect = await visualDiff.getRect(page, '#basic');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

	});

});
