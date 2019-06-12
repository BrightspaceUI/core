const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-icon', function() {

	const visualDiff = new VisualDiff('icon', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await browser.newPage();
		await page.setViewport({width: 800, height: 800, deviceScaleFactor: 2});
		await page.goto(`${visualDiff.getBaseUrl()}/components/icons/test/icon.visual-diff.html`, {waitUntil: ['networkidle0', 'load']});
		await page.bringToFront();
	});

	after(() => browser.close());

	[
		{category: 'preset', tests: ['tier1', 'tier2', 'tier3']},
		{category: 'custom-svg', tests: ['tier1', 'tier2', 'tier3']},
		{category: 'fill', tests: ['none']},
		{category: 'color-override', tests: ['preset', 'trusted-svg', 'untrusted-svg']},
		{category: 'size-override', tests: ['preset', 'custom-svg', 'custom-other']},
		{category: 'rtl', tests: ['preset-tier1', 'preset-tier2', 'preset-tier3', 'custom-svg-tier1', 'custom-svg-tier2', 'custom-svg-tier3']}
	].forEach((entry) => {
		describe(entry.category, () => {
			entry.tests.forEach((name) => {
				it(name, async function() {
					const rect = await visualDiff.getRect(page, `#${entry.category}-${name}`);
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});
			});
		});
	});

});
