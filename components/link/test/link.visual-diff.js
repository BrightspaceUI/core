const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-link', function() {

	const visualDiff = new VisualDiff('link', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await browser.newPage();
		await page.setViewport({width: 800, height: 800, deviceScaleFactor: 2});
		await page.goto(`${visualDiff.getBaseUrl()}/components/link/test/link.visual-diff.html`, {waitUntil: ['networkidle0', 'load']});
		await page.bringToFront();
	});

	after(() => browser.close());

	[
		'wc-standard',
		'wc-main',
		'wc-small',
		'wc-inline',
		'sass-standard',
		'sass-main',
		'sass-small'
	].forEach((name) => {
		it(name, async function() {
			const rect = await visualDiff.getRect(page, `#${name}`);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

	[
		'wc-standard',
		'sass-standard'
	].forEach((name) => {
		it(`focus-${name}`, async function() {
			await page.evaluate((name) => {
				const elem = document.querySelector(`#${name}`);
				elem.focus();
			}, name);
			const rect = await visualDiff.getRect(page, `#${name}`);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

});
