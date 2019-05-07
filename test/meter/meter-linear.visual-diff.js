const puppeteer = require('puppeteer');
const VisualDiff = require('visual-diff');

describe('d2l-meter-linear', function() {

	const visualDiff = new VisualDiff('meter-linear', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await browser.newPage();
		await page.setViewport({width: 800, height: 800, deviceScaleFactor: 2});
		await page.goto(`${visualDiff.getBaseUrl()}/test/meter/meter-linear.visual-diff.html`, {waitUntil: ['networkidle0', 'load']});
		await page.bringToFront();
	});

	after(() => browser.close());

	it('no-progress', async function() {
		const rect = await visualDiff.getRect(page, '#no-progress');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('has-progress', async function() {
		const rect = await visualDiff.getRect(page, '#has-progress');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('completed', async function() {
		const rect = await visualDiff.getRect(page, '#completed');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

});
