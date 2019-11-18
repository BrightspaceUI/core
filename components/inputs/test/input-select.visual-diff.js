const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-input-select', () => {

	const visualDiff = new VisualDiff('input-select', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await browser.newPage();
		await page.setViewport({width: 800, height: 800, deviceScaleFactor: 2});
		await page.goto(`${visualDiff.getBaseUrl()}/components/inputs/test/input-select.visual-diff.html`, {waitUntil: ['networkidle0', 'load']});
		await page.bringToFront();
	});

	after(() => browser.close());

	beforeEach(async() => {
		await visualDiff.resetFocus(page);
	});

	['default', 'overflow', 'disabled', 'invalid', 'rtl', 'rtl-overflow'].forEach((name) => {
		it(name, async function() {
			const rect = await visualDiff.getRect(page, `#${name}`);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

	['default', 'overflow', 'invalid', 'rtl', 'rtl-overflow'].forEach((name) => {
		it(`${name}-focus`, async function() {
			await page.$eval(`#${name}`, (elem) => elem.focus());
			const rect = await visualDiff.getRect(page, `#${name}`);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

});
