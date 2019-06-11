const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-floating-buttons', function() {

	const visualDiff = new VisualDiff('floating-buttons', __dirname);
	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await browser.newPage();
		await page.setViewport({width: 800, height: 800, deviceScaleFactor: 2});
		await page.goto(`${visualDiff.getBaseUrl()}/components/button/test/floating-buttons.visual-diff.html`, {waitUntil: ['networkidle0', 'load']});
		await page.bringToFront();
	});

	after(() => browser.close());

	[
		{category: 'normal-screen-size', tests: ['isFloating']},
		{category: 'mobile-screen-size', tests: ['isFloating']},
		{category: 'normal-screen-size-rtl', tests: ['isFloating']}
	].forEach((entry) => {
		describe(entry.category, () => {

			it('isFloating', async function() {
				setAlwaysFloat(page, 'floating-button');
				const rect = await visualDiff.getRect(page, `#${entry.category}`);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

		});
	});

	const setAlwaysFloat = (page, selector) => {
		return page.evaluate((selector) => {
			return new Promise((resolve) => {
				const elem = document.querySelector(selector);
				elem.parentNode.alwaysFloat = true;
				resolve();
			});
		}, selector);
	};
});
