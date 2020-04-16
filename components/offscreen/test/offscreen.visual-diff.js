const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-offscreen', () => {

	const visualDiff = new VisualDiff('offscreen', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);
		await page.setViewport({width: 800, height: 800, deviceScaleFactor: 2});
		await page.goto(`${visualDiff.getBaseUrl()}/components/offscreen/test/offscreen.visual-diff.html`, {waitUntil: ['networkidle0', 'load']});
		await page.bringToFront();
	});

	after(async() => await browser.close());

	[
		'wc',
		'style',
		'sass'
	].forEach((name) => {
		['ltr', 'rtl'].forEach((dir) => {
			const test = `${name}-${dir}`;
			it(test, async function() {
				const rect = await visualDiff.getRect(page, `#${test}`);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});
		});
	});

});
