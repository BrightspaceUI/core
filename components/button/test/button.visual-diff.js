const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-button', () => {

	const visualDiff = new VisualDiff('button', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);
		await page.setViewport({width: 800, height: 800, deviceScaleFactor: 2});
		await page.goto(`${visualDiff.getBaseUrl()}/components/button/test/button.visual-diff.html`, {waitUntil: ['networkidle0', 'load']});
		await page.bringToFront();
	});

	after(async() => await browser.close());

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
						await page.$eval(`#${entry.category}`, (elem) => elem.focus());
					}

					const rectId = (name.indexOf('disabled') !== -1) ? name : entry.category;
					const rect = await visualDiff.getRect(page, `#${rectId}`);
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});
			});
		});
	});

});
