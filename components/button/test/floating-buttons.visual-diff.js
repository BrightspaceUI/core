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
		{category: 'normal', tests: ['normal', 'hover', 'focus', 'disabled']},
	].forEach((entry) => {
		describe(entry.category, () => {
			entry.tests.forEach((name) => {
				it(name, async function() {
					if (name === 'hover') {
						await page.hover(`#${entry.category}`);
					} else if (name === 'focus') {
						await focus(page, `#${entry.category}`);
					}
					const rect = await visualDiff.getRect(page, `#${entry.category}`);
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});
			});
		});
	});

	const focus = (page, selector) => {
		return page.evaluate((selector) => {
			return new Promise((resolve) => {
				const elem = document.querySelector(selector);
				elem.shadowRoot.querySelector('button').addEventListener('transitionend', resolve);
				elem.focus();
			});
		}, selector);
	};

});
