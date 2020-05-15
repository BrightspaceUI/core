const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-alert', () => {

	const visualDiff = new VisualDiff('alert', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser, { viewport: { width: 800, height: 1200 } });
		await page.goto(`${visualDiff.getBaseUrl()}/components/alert/test/alert.visual-diff.html`, {waitUntil: ['networkidle0', 'load']});
		await page.bringToFront();
	});

	after(async() => await browser.close());

	[
		'type-default',
		'type-success',
		'type-critical',
		'type-error',
		'type-call-to-action',
		'close',
		'button',
		'button-close',
		'rtl',
		'hidden'
	].forEach((testName) => {
		it(testName, async function() {
			const selector = `#${testName}`;
			const rect = await visualDiff.getRect(page, selector);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

});
