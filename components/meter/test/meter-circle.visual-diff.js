const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-meter-circle', () => {

	const visualDiff = new VisualDiff('meter-circle', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);
		await page.setViewport({width: 800, height: 2500, deviceScaleFactor: 2});
		await page.goto(`${visualDiff.getBaseUrl()}/components/meter/test/meter-circle.visual-diff.html`, {waitUntil: ['networkidle0', 'load']});
		await page.bringToFront();
	});

	after(() => browser.close());

	[
		{ title: 'no-progress', fixture: '#no-progress'},
		{ title: 'has-progress', fixture: '#has-progress'},
		{ title: 'completed', fixture: '#completed'},
		{ title: 'round-to-zero', fixture: '#round-to-zero'},
		{ title: 'max-zero-with-value', fixture: '#max-zero-with-value'},
		{ title: 'no-progress-scaled', fixture: '#no-progress-scaled'},
		{ title: 'has-progress-scaled', fixture: '#has-progress-scaled'},
		{ title: 'completed-scaled', fixture: '#completed-scaled'},
		{ title: 'no-progress-rtl', fixture: '#no-progress-rtl'},
		{ title: 'has-progress-rtl', fixture: '#has-progress-rtl'},
		{ title: 'completed-rtl', fixture: '#completed-rtl'},
		{ title: 'no-progress-light', fixture: '#no-progress-light'},
		{ title: 'has-progress-light', fixture: '#has-progress-light'},
		{ title: 'completed-light', fixture: '#completed-light'}
	].forEach((testData) => {
		it(testData.title, async function() {
			const rect = await visualDiff.getRect(page, testData.fixture);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

});
