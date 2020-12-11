const helper = require('./dropdown-helper.js');
const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-dropdown-content-contained', () => {

	const visualDiff = new VisualDiff('dropdown-content-contained', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);
		await page.goto(`${visualDiff.getBaseUrl()}/components/dropdown/test/dropdown-content-contained.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	after(async() => await browser.close());

	[
		'contained-top',
		'contained-bottom'
	].forEach((testName) => {
		it(testName, async function() {
			const rect = await visualDiff.getRect(page, `#${testName}`);
			const selector = `#${testName} d2l-dropdown`;
			await helper.open(page, selector);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

});
