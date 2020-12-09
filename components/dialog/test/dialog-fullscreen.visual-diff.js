const helper = require('./dialog-helper.js');
const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-dialog-fullscreen', () => {

	const visualDiff = new VisualDiff('dialog-fullscreen', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);
	});

	after(async() => await browser.close());

	['native', 'custom'].forEach((name) => {

		describe(name, () => {

			before(async() => {
				const preferNative = (name === 'native' ? '' : '?preferNative=false');
				await page.goto(`${visualDiff.getBaseUrl()}/components/dialog/test/dialog-fullscreen.visual-diff.html${preferNative}`, { waitUntil: ['networkidle0', 'load'] });
				await page.bringToFront();
			});

			beforeEach(async() => {
				await helper.reset(page, '#dialog');
				await helper.reset(page, '#dialogLong');
				await helper.reset(page, '#dialogRtl');
				await helper.reset(page, '#dialogNoFooterContent');
			});

			[
				{ category: 'wide', viewport: { width: 800, height: 500 } },
				{ category: 'narrow', viewport: { width: 600, height: 500 } }
			].forEach((info) => {

				describe(info.category, () => {

					before(async() => {
						await page.setViewport({ width: info.viewport.width, height: info.viewport.height, deviceScaleFactor: 2 });
					});

					it('opened', async function() {
						await helper.open(page, '#dialog');
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
					});

					it('rtl', async function() {
						await helper.open(page, '#dialogRtl');
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
					});

				});

			});

			describe('internal', () => {

				before(async() => {
					await page.setViewport({ width: 800, height: 500, deviceScaleFactor: 2 });
				});

				it('no footer content', async function() {
					await helper.open(page, '#dialogNoFooterContent');
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
				});

				it('scroll bottom shadow', async function() {
					await helper.open(page, '#dialogLong');
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
				});

				it('scroll top shadow', async function() {
					await helper.open(page, '#dialogLong');
					await page.$eval('#dialogLong #bottom', (bottom) => {
						bottom.scrollIntoView();
					});
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
				});

			});

		});

	});

});
