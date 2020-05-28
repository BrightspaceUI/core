const helper = require('./alert-toast-helper.js');
const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-alert-toast', () => {

	const visualDiff = new VisualDiff('alert', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser, { viewport: { width: 700, height: 400 } });
		await page.goto(`${visualDiff.getBaseUrl()}/components/alert/test/alert-toast.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	after(async() => await browser.close());

	afterEach(async() => {
		await page.reload();
	});

	[
		'default',
		'no-close',
		'button-close',
		'subtext-button-close'
	].forEach((testName) => {
		it(testName, async function() {
			const selector = `#${testName}`;
			await helper.open(page, selector);
			const rect = await helper.getRect(page, selector);

			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

	describe('responsive-position', () => {
		it('wide', async function() {
			await helper.open(page, '#subtext-button-close');

			await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
		});

		it('narrow', async function() {
			page = await visualDiff.createPage(browser, { viewport: { width: 400, height: 400 } });
			await page.goto(`${visualDiff.getBaseUrl()}/components/alert/test/alert-toast.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
			await page.bringToFront();
			await helper.open(page, '#subtext-button-close');

			await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
		});
	});

});
