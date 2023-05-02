import { close, getCloseEvent, open, reset } from './dialog-helper.js';
import puppeteer from 'puppeteer';
import VisualDiff from '@brightspace-ui/visual-diff';

describe('d2l-dialog-mixin', () => {

	const visualDiff = new VisualDiff('dialog-mixin', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch({ headless: 'new' });
		page = await visualDiff.createPage(browser);
	});

	after(async() => await browser.close());

	['native', 'custom'].forEach((name) => {

		describe(name, () => {

			before(async() => {
				const preferNative = (name === 'native' ? '' : '?preferNative=false');
				await page.goto(`${visualDiff.getBaseUrl()}/components/dialog/test/dialog-mixin.visual-diff.html${preferNative}`, { waitUntil: ['networkidle0', 'load'] });
				await page.bringToFront();
			});

			beforeEach(async() => {
				await reset(page, '#dialog');
			});

			describe('generic', () => {

				before(async() => {
					await page.setViewport({ width: 800, height: 500, deviceScaleFactor: 2 });
				});

				it('initial closed', async function() {
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { captureBeyondViewport: false });
				});

				it('closed', async function() {
					await open(page, '#dialog');
					await close(page, '#dialog');
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { captureBeyondViewport: false });
				});

				it('abort', async function() {
					await open(page, '#dialog');
					const closeEvent = getCloseEvent(page, '#dialog');
					await page.$eval('#dialog', (dialog) => {
						dialog.shadowRoot.querySelector('d2l-button-icon').click();
					});
					await closeEvent;
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { captureBeyondViewport: false });
				});

				it('escape', async function() {
					await open(page, '#dialog');
					const closeEvent = getCloseEvent(page, '#dialog');

					/* test handler for dialog's custom close event strangely does not get
					invoked when using puppeteer's keyboard api for the escape key for the
					custom dialog impl even though it gets dispatched. use custom event instead. */
					page.$eval('#dialog', (dialog) => {
						const event = new CustomEvent('keydown', {
							bubbles: true,
							cancelable: true,
							composed: true
						});
						event.keyCode = 27;
						event.code = 27;
						dialog.querySelector('d2l-button').dispatchEvent(event);
					});

					await closeEvent;
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { captureBeyondViewport: false });
				});

			});

		});

	});

});
