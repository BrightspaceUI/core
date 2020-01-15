const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-calendar', function() {

	const visualDiff = new VisualDiff('calendar', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await browser.newPage();
		await page.setViewport({width: 500, height: 800, deviceScaleFactor: 2});
		await page.goto(`${visualDiff.getBaseUrl()}/components/calendar/test/calendar.visual-diff.html`, {waitUntil: ['networkidle0', 'load']});
		await page.bringToFront();
	});

	after(() => browser.close());

	it('selects today when no selected-value specified', async function() {
		const rect = await visualDiff.getRect(page, '#no-selected');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('emphasizes today when different date in same month selected', async function() {
		const rect = await visualDiff.getRect(page, '#contains-today-diff-selected');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('selects today when today specified as selected-value', async function() {
		const rect = await visualDiff.getRect(page, '#today-selected');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('month with first row entirely current month days and last row containing next month days', async function() {
		const rect = await visualDiff.getRect(page, '#dec-2019');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('month with first row containing previous month days and last row entirely current month', async function() {
		const rect = await visualDiff.getRect(page, '#nov-2019');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

});
