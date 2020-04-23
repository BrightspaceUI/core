const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-skeleton', () => {

	const visualDiff = new VisualDiff('skeleton', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);
		await page.goto(`${visualDiff.getBaseUrl()}/components/skeleton/test/skeleton.visual-diff.html`, {waitUntil: ['networkidle0', 'load']});
		await page.bringToFront();
	});

	after(async() => await browser.close());

	[
		'wc-text',
		'wc-image',
		'sass-text',
		'sass-image'
	].forEach((name) => {
		it(name, async function() {
			const rect = await visualDiff.getRect(page, `#${name}`);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

});
