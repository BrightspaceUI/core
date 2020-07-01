const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-input-date-time-range', () => {

	const visualDiff = new VisualDiff('input-date-time-range', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await browser.newPage();
		await page.setViewport({width: 800, height: 1700, deviceScaleFactor: 2});
		await page.goto(`${visualDiff.getBaseUrl()}/components/inputs/test/input-date-time-range.visual-diff.html`, {waitUntil: ['networkidle0', 'load']});
		await page.bringToFront();
	});

	after(async() => await browser.close());

	[
		'basic',
		'disabled',
		'invalid-start-value',
		'labelled',
		'label-hidden',
		'slotted-content',
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

		before(async() => {
			await page.$eval('#basic', (elem) => elem.blur());
		});

		it.skip('change start date to be after end date', async function() {
			//TODO: enable after validation
			await page.$eval('#basic', (elem) => {
				const endDateSelector = elem.shadowRoot.querySelector('d2l-input-date-time.d2l-input-date-time-range-end');
				endDateSelector.value = '2018-02-02T05:00:00.000Z';
				const e = new Event(
					'change',
					{ bubbles: true, composed: true }
				);
				endDateSelector.dispatchEvent(e);

				const startDateSelector = elem.shadowRoot.querySelector('d2l-input-date-time.d2l-input-date-time-range-start');
				startDateSelector.value = '2018-12-02T05:00:00.000Z';
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
				const startDateSelector = elem.shadowRoot.querySelector('d2l-input-date-time.d2l-input-date-time-range-start');
				startDateSelector.value = '2018-02-02T05:00:00.000Z';
				const e = new Event(
					'change',
					{ bubbles: true, composed: true }
				);
				startDateSelector.dispatchEvent(e);

				const endDateSelector = elem.shadowRoot.querySelector('d2l-input-date-time.d2l-input-date-time-range-end');
				endDateSelector.value = '2017-02-02T05:00:00.000Z';
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
