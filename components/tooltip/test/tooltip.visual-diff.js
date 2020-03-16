const helper = require('./tooltip-helper.js');
const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-tooltip', () => {

	const visualDiff = new VisualDiff('tooltip', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await browser.newPage();
		await page.setViewport({width: 400, height: 400, deviceScaleFactor: 2});
		await page.goto(`${visualDiff.getBaseUrl()}/components/tooltip/test/tooltip.visual-diff.html`, {waitUntil: ['networkidle0', 'load']});
		await page.bringToFront();
	});

	after(() => browser.close());

	[
		'position-top',
		'position-bottom',
		'position-right',
		'position-left',
		'top-left',
		'top-middle',
		'top-right',
		'bottom-left',
		'bottom-middle',
		'bottom-right',
		'middle-left',
		'middle-right',
		'boundary-top-right',
		'boundary-bottom-left',
		'min-width',
		'max-width',
		'horizontal',
		'horizontal-rtl',
		'wide-target-horizontal',
		'wide-target-vertical',
		'too-big-for-space'
	].forEach((testName) => {

		it(testName, async function() {
			const selector = `#${testName}`;
			await helper.show(page, selector);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
			await helper.hide(page, selector);
		});

	});

});
