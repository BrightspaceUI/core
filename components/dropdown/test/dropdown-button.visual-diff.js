const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');
const helper = require('./dropdown-helper.js');

describe('d2l-dropdown-button', () => {

	const visualDiff = new VisualDiff('dropdown-button', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await browser.newPage();
		await page.setViewport({ width: 300, height: 400, deviceScaleFactor: 2 });
		await page.goto(`${visualDiff.getBaseUrl()}/components/dropdown/test/dropdown-button.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	after(() => browser.close());

	[
		'default',
		'primary',
		'subtle',
		'rtl'
	].forEach((testName) => {
		it(testName, async function() {
			const selector = `#${testName}`;
			const rect = await visualDiff.getRect(page, selector);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

	[
		{ name: 'default-open', id: '#default'},
		{ name: 'subtle-open', id: '#subtle' },
	].forEach((testCase) => {
		it(testCase.name, async function() {
			await helper.open(page, testCase.id);
			const rect = await helper.getRect(page, testCase.id);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

});
