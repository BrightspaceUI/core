const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-template-primary-secondary', function() {

	const visualDiff = new VisualDiff('primary-secondary', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await browser.newPage();
		await page.setViewport({width: 930, height: 930, deviceScaleFactor: 2});
		await page.goto(`${visualDiff.getBaseUrl()}/templates/primary-secondary/test/primary-secondary.visual-diff.html`, {waitUntil: ['networkidle0', 'load']});
		await page.bringToFront();
	});

	after(() => browser.close());

	[
		{category: 'normal', tests: [
			{ name: 'normal', selector: '#normal' },
			{ name: 'larger-than-viewport-height', selector: '#larger-than-viewport-height' }
		]},

	].forEach((entry) => {
		describe(entry.category, () => {
			entry.tests.forEach((info) => {
				it(info.name, async function() {
					const rect = await visualDiff.getRect(page, info.selector);
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});
			});
		});
	});

});
