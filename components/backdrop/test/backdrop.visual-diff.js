const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-backdrop', () => {

	const visualDiff = new VisualDiff('backdrop', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);
		await page.setViewport({width: 800, height: 600, deviceScaleFactor: 2});
		await page.goto(`${visualDiff.getBaseUrl()}/components/backdrop/test/backdrop.visual-diff.html`, {waitUntil: ['networkidle0', 'load']});
		await page.bringToFront();
	});

	after(async() => await browser.close());

	it('not shown', async function() {
		const rect = await visualDiff.getRect(page, '.visual-diff');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('shown', async function() {
		await page.$eval('d2l-backdrop', backdrop => backdrop.shown = true);
		const rect = await visualDiff.getRect(page, '.visual-diff');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

});
