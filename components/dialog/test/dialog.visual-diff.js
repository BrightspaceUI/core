const helper = require('./dialog-helper.js');
const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-dialog', () => {

	const visualDiff = new VisualDiff('dialog', __dirname);

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
				await page.goto(`${visualDiff.getBaseUrl()}/components/dialog/test/dialog.visual-diff.html${preferNative}`, {waitUntil: ['networkidle0', 'load']});
				await page.bringToFront();
			});

			beforeEach(async() => {
				await helper.reset(page, '#dialog');
				await helper.reset(page, '#dialogLong');
				await helper.reset(page, '#dialogRtl');
				await helper.reset(page, '#dialogResize');
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
						await page.$eval('#dialog', (dialog) => dialog.opened = true);
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
					});

					it('scroll bottom shadow', async function() {
						await page.$eval('#dialogLong', (dialog) => dialog.opened = true);
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
					});

					it('scroll top shadow', async function() {
						await page.$eval('#dialogLong', (dialog) => {
							dialog.opened = true;
							return new Promise((resolve) => {
								requestAnimationFrame(() => {
									dialog.querySelector('#bottom').scrollIntoView();
									resolve();
								});
							});
						});
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
					});

					it('rtl', async function() {
						await page.$eval('#dialogRtl', (dialog) => dialog.opened = true);
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
					});

					it('resize', async function() {
						await page.$eval('#dialogResize', async(dialog) => {
							dialog.opened = true;
							dialog.querySelector('div').style.height = '60px';
							dialog.width = 500;
							dialog.resize();
							return new Promise((resolve) => requestAnimationFrame(resolve));
						});
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
					});

				});

			});

		});

	});

});
