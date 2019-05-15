const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-meter-linear', function() {

	const visualDiff = new VisualDiff('meter-linear', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await browser.newPage();
		await page.setViewport({width: 800, height: 800, deviceScaleFactor: 2});
		await page.goto(`${visualDiff.getBaseUrl()}/components/meter/test/meter-linear.visual-diff.html`, {waitUntil: ['networkidle0', 'load']});
		await page.bringToFront();
	});

	after(() => browser.close());

	[
		{ title: 'no-progress', fixture: '#no-progress'},
		{ title: 'has-progress', fixture: '#has-progress'},
		{ title: 'completed', fixture: '#completed'},
		{ title: 'max-zero', fixture: '#max-zero'}
	].forEach((testData) => {
		it(testData.title, async function() {
			const rect = await visualDiff.getRect(page, testData.fixture);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});
});
