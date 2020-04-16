const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('colors', () => {

	const visualDiff = new VisualDiff('colors', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);
		await page.setViewport({width: 800, height: 3000, deviceScaleFactor: 2});
		await page.goto(`${visualDiff.getBaseUrl()}/components/colors/test/colors.visual-diff.html`, {waitUntil: ['networkidle0', 'load']});
		await page.bringToFront();
	});

	after(async() => await browser.close());

	it('palette', async function() {
		const rect = await visualDiff.getRect(page, '#palette');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

});
