const helper = require('./dialog-helper.js');
const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-dialog-mixin', () => {

	const visualDiff = new VisualDiff('dialog-mixin', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);
	});

	after(() => browser.close());

	['native', 'custom'].forEach((name) => {

		describe(name, () => {

			before(async() => {
				const preferNative = (name === 'native' ? '' : '?preferNative=false');
				await page.goto(`${visualDiff.getBaseUrl()}/components/dialog/test/dialog-mixin.visual-diff.html${preferNative}`, {waitUntil: ['networkidle0', 'load']});
				await page.bringToFront();
			});

			beforeEach(async() => {
				await helper.reset(page, '#dialog');
			});

			describe('generic', () => {

				before(async() => {
					await page.setViewport({ width: 800, height: 500, deviceScaleFactor: 2 });
				});

				it('initial closed', async function() {
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
				});

				it('closed', async function() {
					await helper.open(page, '#dialog');
					await helper.close(page, '#dialog');
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
				});

				it('abort', async function() {
					await helper.open(page, '#dialog');
					const closeEvent = helper.getCloseEvent(page, '#dialog');
					await page.$eval('#dialog', (dialog) => {
						dialog.shadowRoot.querySelector('d2l-button-icon').click();
					});
					await closeEvent;
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
				});

				it('escape', async function() {
					await helper.open(page, '#dialog');
					const closeEvent = helper.getCloseEvent(page, '#dialog');

					/* test handler for dialog's custom close event strangely does not get
					invoked when using puppeteer's keyboard api for the escape key for the
					custom dialog impl even though it gets dispatched. use custom event instead. */
					page.$eval('#dialog', (dialog) => {
						const event = new CustomEvent('keyup', {
							bubbles: true,
							cancelable: true,
							composed: true
						});
						event.keyCode = 27;
						event.code = 27;
						dialog.querySelector('d2l-button').dispatchEvent(event);
					});

					await closeEvent;
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
				});

			});

		});

	});

});
