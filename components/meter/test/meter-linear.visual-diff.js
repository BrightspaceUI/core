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
		{ title: 'max-zero', fixture: '#max-zero'},
		{ title: 'round-to-zero', fixture: '#round-to-zero'},
		{ title: 'over-100', fixture: '#over-100'},
		{ title: 'zero-max', fixture: '#zero-max'},
		{ title: 'no-progress-rtl', fixture: '#no-progress-rtl'},
		{ title: 'has-progress-rtl', fixture: '#has-progress-rtl'},
		{ title: 'completed-rtl', fixture: '#completed-rtl'},
		{ title: 'over-100-rtl', fixture: '#over-100-rtl'},
		{ title: 'no-progress-light', fixture: '#no-progress-light'},
		{ title: 'has-progress-light', fixture: '#has-progress-light'},
		{ title: 'completed-light', fixture: '#completed-light'},
		{ title: 'over-100-light', fixture: '#over-100-light'}
	].forEach((testData) => {
		it(testData.title, async function() {
			const rect = await visualDiff.getRect(page, testData.fixture);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});
});
