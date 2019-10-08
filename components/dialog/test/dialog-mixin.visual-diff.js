const helper = require('./dialog-helper.js');
const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-dialog-mixin', function() {

	const visualDiff = new VisualDiff('dialog-mixin', __dirname);

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
				await page.goto(`${visualDiff.getBaseUrl()}/components/dialog/test/dialog-mixin.visual-diff.html${preferNative}`, {waitUntil: ['networkidle0', 'load']});
				await page.bringToFront();
			});

			beforeEach(async() => {
				await helper.reset(page, '#dialog');
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

			describe('focus trap', function() {

				before(async() => {
					await page.setViewport({ width: 800, height: 500, deviceScaleFactor: 2 });
				});

				it('wrap to first', async function() {
					await helper.open(page, '#dialog');
					await page.$eval('#dialog', (dialog) => {
						dialog.shadowRoot.querySelector('.d2l-dialog-trap-end').focus();
					});
					const rect = await helper.getRect(page, '#dialog');
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});

				it('wrap to last', async function() {
					await helper.open(page, '#dialog');
					await page.$eval('#dialog', (dialog) => {
						dialog.shadowRoot.querySelector('.d2l-dialog-trap-start').focus();
					});
					const rect = await helper.getRect(page, '#dialog');
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});

				it('redirect from body', async function() {
					await helper.open(page, '#dialog');
					await page.$eval('#open', (button) => {
						button.focus();
					});
					const rect = await helper.getRect(page, '#dialog');
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});

			});

		});

	});

});
