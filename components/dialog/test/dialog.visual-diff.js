const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-dialog', function() {

	const visualDiff = new VisualDiff('dialog', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await browser.newPage();
	});

	after(() => browser.close());

	['native', 'custom'].forEach((name) => {

		describe(name, function() {

			before(async() => {
				const preferNative = (name === 'native' ? '' : '?preferNative=false' );
				await page.goto(`${visualDiff.getBaseUrl()}/components/dialog/test/dialog.visual-diff.html${preferNative}`, {waitUntil: ['networkidle0', 'load']});
				await page.bringToFront();
			});

			beforeEach(async() => {
				await reset(page, '#dialog');
				await reset(page, '#dialogLong');
				await reset(page, '#dialogRtl');
			});

			describe('generic', function() {

				before(async() => {
					await page.setViewport({ width: 800, height: 500, deviceScaleFactor: 2 });
				});

				it('initial closed', async function() {
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
				});

				it('closed', async function() {
					await open(page, '#dialog');
					await close(page, '#dialog');
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
				});

				it('abort', async function() {
					await open(page, '#dialog');
					const closeEvent = getCloseEvent(page, '#dialog');
					await page.evaluate(() => {
						document.querySelector('#dialog').shadowRoot.querySelector('d2l-button-icon').click();
					});
					await closeEvent;
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
				});

				it('escape', async function() {
					await open(page, '#dialog');
					const closeEvent = getCloseEvent(page, '#dialog');
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
						await open(page, '#dialog');
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
					});

					it('scroll bottom shadow', async function() {
						await open(page, '#dialogLong');
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
					});

					it('scroll top shadow', async function() {
						await open(page, '#dialogLong');
						await page.evaluate(() => {
							document.querySelector('#dialogLong #bottom').scrollIntoView();
						});
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
					});

					it('rtl', async function() {
						await open(page, '#dialogRtl');
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
					});

				});

			});

			describe('focus trap', function() {

				before(async() => {
					await page.setViewport({ width: 800, height: 500, deviceScaleFactor: 2 });
				});

				it('wrap to first', async function() {
					await open(page, '#dialog');
					await page.evaluate(() => {
						document.querySelector('#dialog #cancel').focus();
					});
					await page.keyboard.press('Tab');
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
				});

				it('wrap to last', async function() {
					await open(page, '#dialog');
					await page.evaluate(() => {
						document.querySelector('#dialog').shadowRoot.querySelector('d2l-button-icon').focus();
					});
					await page.keyboard.down('Shift');
					await page.keyboard.press('Tab');
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
				});

				it('redirect from body', async function() {
					await open(page, '#dialog');
					await page.evaluate(() => {
						document.querySelector('#open').focus();
					});
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
				});

			});

		});

	});

	const close = async(page, selector) => {
		const closeEvent = getCloseEvent(page, selector);
		await page.evaluate((selector) => {
			document.querySelector(selector).opened = false;
		}, selector);
		return closeEvent;
	};

	const getCloseEvent = (page, selector) => {
		return getEvent(page, selector, 'd2l-dialog-close');
	};

	const getEvent = (page, selector, name) => {
		return page.evaluate((selector, name) => {
			return new Promise((resolve) => {
				const dialog = document.querySelector(selector);
				dialog.addEventListener(name, resolve, { once: true });
			});
		}, selector, name);
	};

	const getOpenEvent = (page, selector) => {
		return getEvent(page, selector, 'd2l-dialog-open');
	};

	const open = async(page, selector) => {
		const openEvent = getOpenEvent(page, selector);
		await page.evaluate((selector) => {
			document.querySelector(selector).opened = true;
		}, selector);
		return openEvent;
	};

	const reset = async(page, selector) => {
		await page.evaluate((selector) => {
			return new Promise((resolve) => {
				const dialog = document.querySelector(selector);
				dialog.shadowRoot.querySelector('.d2l-dialog-content').scrollTo(0, 0);
				if (dialog._state) {
					dialog.addEventListener('d2l-dialog-close', () => resolve(), { once: true });
					dialog.opened = false;
				} else {
					resolve();
				}
			});
		}, selector);
		return page.click('#open');
	};

});
