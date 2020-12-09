const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-form-error-summary', () => {

	const visualDiff = new VisualDiff('form-error-summary', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser, { viewport: { width: 800, height: 1200 } });
		await page.goto(`${visualDiff.getBaseUrl()}/components/form/test/form-error-summary.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	after(async() => await browser.close());

	[
		'no-errors',
		'expanded-single-error',
		'expanded-multiple-errors',
		'collapsed',
	].forEach((testName) => {
		it(testName, async function() {
			const selector = `#${testName}`;
			const rect = await visualDiff.getRect(page, selector);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

});
