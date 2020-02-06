const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-input-label', () => {

	const visualDiff = new VisualDiff('input-label', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await browser.newPage();
		await page.setViewport({width: 800, height: 800, deviceScaleFactor: 2});
		await page.goto(`${visualDiff.getBaseUrl()}/components/inputs/test/input-label.visual-diff.html`, {waitUntil: ['networkidle0', 'load']});
		await page.bringToFront();
	});

	after(() => browser.close());

	[
		'wc-wrap',
		'wc-wrap-required',
		'wc-ref',
		'wc-ref-required',
		'sass-wrap',
		'sass-wrap-required',
		'sass-ref',
		'sass-ref-required',
		'wc-fieldset',
		'wc-fieldset-required',
		'wc-fieldset-manual',
		'wc-fieldset-manual-required'
	].forEach((name) => {
		it(name, async function() {
			const rect = await visualDiff.getRect(page, `#${name}`);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

});
