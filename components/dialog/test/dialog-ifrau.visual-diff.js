const helper = require('./dialog-helper.js');
const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-dialog-ifrau', function() {

	const visualDiff = new VisualDiff('dialog-ifrau', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await browser.newPage();
		await visualDiff.disableAnimations(page);
	});

	after(() => browser.close());

	['native', 'custom'].forEach((name) => {

		describe(name, function() {

			before(async() => {
				const preferNative = (name === 'native' ? '' : '?preferNative=false');
				await page.goto(`${visualDiff.getBaseUrl()}/components/dialog/test/dialog-ifrau.visual-diff.html${preferNative}`, {waitUntil: ['networkidle0', 'load']});
				await page.setViewport({ width: 650, height: 450, deviceScaleFactor: 2 });
				await page.bringToFront();
			});

			beforeEach(async() => {
				await helper.reset(page, '#ifrau-dialog');
			});

			[
				{ name: 'ifrau top height lt dialog top margin', ifrau: { availableHeight: 500, top: 50 } },
				{ name: 'ifrau top height gt dialog top margin', ifrau: { availableHeight: 500, top: 120 } },
				{ name: 'ifrau available height lt host height', ifrau: { availableHeight: 300, top: 50 } },
				{ name: 'host scrolled down', ifrau: { availableHeight: 400, top: -50 } }
			].forEach((info) => {
				it(info.name, async function() {
					await page.evaluate((info) => {
						window.ifrauAvailableHeight = info.ifrau.availableHeight;
						window.ifrauTop = info.ifrau.top;
					}, info);
					await helper.open(page, '#ifrau-dialog');
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
				});
			});

		});

	});

});
