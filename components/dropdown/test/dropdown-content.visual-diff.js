const helper = require('./dropdown-helper.js');
const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-dropdown-content', () => {

	const visualDiff = new VisualDiff('dropdown-content', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await browser.newPage();
		await page.setViewport({width: 800, height: 400, deviceScaleFactor: 2});
		await page.goto(`${visualDiff.getBaseUrl()}/components/dropdown/test/dropdown-content.visual-diff.html`, {waitUntil: ['networkidle0', 'load']});
		await page.bringToFront();
	});

	after(() => browser.close());

	[
		'default-width',
		'min-width',
		'default-max-width',
		'max-width',
		'scroll-bottom-shadow',
		'top-middle',
		'top-right',
		'bottom-left',
		'bottom-middle',
		'bottom-right',
		'no-padding-no-pointer',
		'align-start',
		'align-end',
		'vertical-offset',
		'rtl',
		'boundary-left-below',
		'boundary-right-above'
	].forEach((testName) => {
		it(testName, async function() {
			const selector = `#${testName}`;
			await helper.open(page, selector);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
		});
	});

	it('scroll-top-shadow', async function() {
		const selector = '#scroll-top-shadow';
		await helper.open(page, selector);
		await page.$eval('#scroll-top-shadow d2l-dropdown-content', (content) => {
			content.scrollTo(1000);
		});
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
	});

});
