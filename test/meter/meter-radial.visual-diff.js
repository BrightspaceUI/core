const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-meter-radial', function() {

	const visualDiff = new VisualDiff('meter-radial', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await browser.newPage();
		await page.setViewport({width: 800, height: 800, deviceScaleFactor: 2});
		await page.goto(`${visualDiff.getBaseUrl()}/test/meter/meter-radial.visual-diff.html`, {waitUntil: ['networkidle0', 'load']});
		await page.bringToFront();
	});

	after(() => browser.close());

	[
		{ title: 'Meter with no progress', fixture: '#no-progress'},
		{ title: 'Meter with progress', fixture: '#has-progress'},
		{ title: 'Meter completed', fixture: '#completed'}
	].forEach((testData) => {
		it(testData.title, async function() {
			const rect = await visualDiff.getRect(page, testData.fixture);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

});
