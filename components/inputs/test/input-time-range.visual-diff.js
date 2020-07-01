const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-input-time-range', () => {

	const visualDiff = new VisualDiff('input-time-range', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await browser.newPage();
		await page.setViewport({width: 800, height: 1200, deviceScaleFactor: 2});
		await page.goto(`${visualDiff.getBaseUrl()}/components/inputs/test/input-time-range.visual-diff.html`, {waitUntil: ['networkidle0', 'load']});
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

		before(async() => {
			await page.$eval('#basic', (elem) => elem.blur());
		});

		it.skip('change start time to be after end time', async function() {
			//TODO: enable after validation
			await page.$eval('#basic', (elem) => {
				const endTimeSelector = elem.shadowRoot.querySelector('d2l-input-time.d2l-input-time-range-end');
				endTimeSelector.value = '12:00:00';
				const e = new Event(
					'change',
					{ bubbles: true, composed: true }
				);
				endTimeSelector.dispatchEvent(e);

				const startTimeSelector = elem.shadowRoot.querySelector('d2l-input-time.d2l-input-time-range-start');
				startTimeSelector.value = '13:00:00';
				const e2 = new Event(
					'change',
					{ bubbles: true, composed: true }
				);
				startTimeSelector.dispatchEvent(e2);
			});
			const rect = await visualDiff.getRect(page, '#basic');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it.skip('change end time to be before start time', async function() {
			//TODO: enable after validation
			await page.$eval('#basic', (elem) => {
				const startTimeSelector = elem.shadowRoot.querySelector('d2l-input-time.d2l-input-time-range-start');
				startTimeSelector.value = '12:00:00';
				const e = new Event(
					'change',
					{ bubbles: true, composed: true }
				);
				startTimeSelector.dispatchEvent(e);

				const endTimeSelector = elem.shadowRoot.querySelector('d2l-input-time.d2l-input-time-range-end');
				endTimeSelector.value = '08:30:00';
				const e2 = new Event(
					'change',
					{ bubbles: true, composed: true }
				);
				endTimeSelector.dispatchEvent(e2);
			});
			const rect = await visualDiff.getRect(page, '#basic');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

	});

});
