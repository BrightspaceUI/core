const helper = require('./dialog-helper.js');
const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-dialog', function() {

	const visualDiff = new VisualDiff('dialog', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await browser.newPage();

		const client = await page.target().createCDPSession();
		await client.send('Animation.enable');
		await client.send('Animation.setPlaybackRate', { playbackRate: 100 });
	});

	after(() => browser.close());

	['native', 'custom'].forEach((name) => {

		describe(name, function() {

			before(async() => {
				const preferNative = (name === 'native' ? '' : '?preferNative=false');
				await page.goto(`${visualDiff.getBaseUrl()}/components/dialog/test/dialog.visual-diff.html${preferNative}`, {waitUntil: ['networkidle0', 'load']});
				await page.bringToFront();
			});

			beforeEach(async() => {
				await helper.reset(page, '#dialog');
				await helper.reset(page, '#dialogLong');
				await helper.reset(page, '#dialogRtl');
			});

			describe('generic', function() {

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
					await page.keyboard.up('Escape');
					await closeEvent;
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
				});

			});

			[
				{ category: 'wide', viewport: { width: 800, height: 500 } },
				{ category: 'narrow', viewport: { width: 600, height: 500 } }
			].forEach((info) => {

				describe(info.category, function() {

					before(async() => {
						await page.setViewport({ width: info.viewport.width, height: info.viewport.height, deviceScaleFactor: 2 });
					});

					it('opened', async function() {
						await helper.open(page, '#dialog');
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

					it('rtl', async function() {
						await helper.open(page, '#dialogRtl');
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
					});

				});

			});

			describe('focus trap', function() {

				before(async() => {
					await page.setViewport({ width: 800, height: 500, deviceScaleFactor: 2 });
				});

				it('wrap to first', async function() {
					await helper.open(page, '#dialog');
					await page.$eval('#dialog', (dialog) => {
						dialog.shadowRoot.querySelector('.d2l-dialog-trap-end').focus();
					});
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
				});

				it('wrap to last', async function() {
					await helper.open(page, '#dialog');
					await page.$eval('#dialog', (dialog) => {
						dialog.shadowRoot.querySelector('.d2l-dialog-trap-start').focus();
					});
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
				});

				it('redirect from body', async function() {
					await helper.open(page, '#dialog');
					await page.$eval('#open', (button) => {
						button.focus();
					});
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
				});

			});

		});

	});

});
