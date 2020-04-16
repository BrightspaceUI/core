const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-button-icon', () => {

	const visualDiff = new VisualDiff('button-icon', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);
		await page.setViewport({width: 800, height: 800, deviceScaleFactor: 2});
		await page.goto(`${visualDiff.getBaseUrl()}/components/button/test/button-icon.visual-diff.html`, {waitUntil: ['networkidle0', 'load']});
		await page.bringToFront();
	});

	beforeEach(async() => {
		await visualDiff.resetFocus(page);
	});

	after(async() => await browser.close());

	[
		{category: 'normal', tests: ['normal', 'hover', 'focus', 'disabled']},
		{category: 'translucent-enabled', tests: ['normal', 'focus', 'hover', 'disabled']},
		{category: 'custom', tests: ['normal', 'hover', 'focus']}
	].forEach((entry) => {
		describe(entry.category, () => {
			entry.tests.forEach((name) => {
				it(name, async function() {
					const selector = (entry.category === 'translucent-enabled') ? '#translucent-enabled > d2l-button-icon' : `#${entry.category}`;

					if (name === 'hover') await page.hover(selector);
					else if (name === 'focus') await page.$eval(selector, (elem) => elem.focus());

					const rectId = (name.indexOf('disabled') !== -1) ? name : entry.category;
					const rect = await visualDiff.getRect(page, `#${rectId}`);
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});
			});
		});
	});

});
