const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');
const helper = require('./dropdown-helper.js');

describe('d2l-dropdown-openers', () => {

	const visualDiff = new VisualDiff('dropdown-openers', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await browser.newPage();
		await page.setViewport({ width: 300, height: 800, deviceScaleFactor: 2 });
		await page.goto(`${visualDiff.getBaseUrl()}/components/dropdown/test/dropdown-openers.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	after(() => browser.close());

	[
		'button-primary',
		'button-rtl',
	].forEach((testName) => {
		it(testName, async function() {
			const selector = `#${testName}`;
			const rect = await visualDiff.getRect(page, selector);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

	[
		'button',
		'button-subtle',
		'context-menu',
		'more'
	].forEach((testName) => {
		it(testName, async function() {
			const selector = `#${testName}`;
			await helper.open(page, selector);
			const rect = await helper.getRect(page, selector);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

});
