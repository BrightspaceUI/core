const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');
const helper = require('./dropdown-helper.js');

describe('d2l-dropdown-openers', () => {

	const visualDiff = new VisualDiff('dropdown-openers', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await browser.newPage();
		await page.setViewport({ width: 300, height: 400, deviceScaleFactor: 2 });
		await page.goto(`${visualDiff.getBaseUrl()}/components/dropdown/test/dropdown-openers.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	after(() => browser.close());

	[
		'button',
		'button-primary',
		'button-subtle',
		'button-rtl',
		'context-menu',
		'context-menu-translucent',
		'context-menu-disabled',
		'context-menu-translucent-disabled'
	].forEach((testName) => {
		it(testName, async function() {
			const selector = `#${testName}`;
			const rect = await visualDiff.getRect(page, selector);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

	[
		{ name: 'button-open', id: '#button'},
		{ name: 'button-subtle-open', id: '#button-subtle'},
		{ name: 'context-menu-open', id: '#context-menu'}
	].forEach((testCase) => {
		it(testCase.name, async function() {
			await helper.open(page, testCase.id);
			const rect = await helper.getRect(page, testCase.id);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

});
