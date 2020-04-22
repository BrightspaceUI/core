const helper = require('./dropdown-helper.js');
const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-dropdown-content', () => {

	const visualDiff = new VisualDiff('dropdown-content', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser, {viewport: {width: 800, height: 400}});
		await page.goto(`${visualDiff.getBaseUrl()}/components/dropdown/test/dropdown-content.visual-diff.html`, {waitUntil: ['networkidle0', 'load']});
		await page.bringToFront();
	});

	after(async() => await browser.close());

	[
		'default-width',
		'min-width',
		'max-width',
		'wide-opener',
		'with-header-footer',
		'no-padding-no-pointer',
		'scroll-bottom-shadow',
		'vertical-offset',
		'boundary-left-below',
		'boundary-right-above',
		'top-left',
		'top-middle',
		'top-right',
		'bottom-left',
		'bottom-middle',
		'bottom-right',
		'align-start',
		'align-end',
		'top-left-rtl',
		'top-middle-rtl',
		'top-right-rtl',
		'bottom-left-rtl',
		'bottom-middle-rtl',
		'bottom-right-rtl',
		'align-start-rtl',
		'align-end-rtl',
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
