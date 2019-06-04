const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-button-icon', function() {

	const visualDiff = new VisualDiff('button-icon', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await browser.newPage();
		await page.setViewport({width: 800, height: 800, deviceScaleFactor: 2});
		await page.goto(`${visualDiff.getBaseUrl()}/components/button/test/button-icon.visual-diff.html`, {waitUntil: ['networkidle0', 'load']});
		await page.bringToFront();
	});

	beforeEach(async() => {
		await visualDiff.resetFocus(page);
	});

	after(() => browser.close());

	[
		{category: 'normal', tests: ['normal', 'hover', 'focus', 'disabled']},
		{category: 'primary', tests: ['normal', 'hover', 'focus', 'primary-disabled']},
	].forEach((entry) => {
		describe(entry.category, () => {
			entry.tests.forEach((name) => {
				it(name, async function() {
					if (name === 'hover') {
						await page.hover(`#${entry.category}`);
					} else if (name === 'focus') {
						await focus(page, `#${entry.category}`);
					}

					const rectId = name.contains('disabled') ? name : entry.category;
					const rect = await visualDiff.getRect(page, `#${rectId}`);
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});
			});
		});
	});

});
