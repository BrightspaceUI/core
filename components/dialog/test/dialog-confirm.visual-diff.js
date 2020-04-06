const helper = require('./dialog-helper.js');
const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-dialog-confirm', () => {

	const visualDiff = new VisualDiff('dialog-confirm', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await browser.newPage();
		await visualDiff.disableAnimations(page);
	});

	after(() => browser.close());

	['native', 'custom'].forEach((name) => {

		describe(name, () => {

			before(async() => {
				const preferNative = (name === 'native' ? '' : '?preferNative=false');
				await page.goto(`${visualDiff.getBaseUrl()}/components/dialog/test/dialog-confirm.visual-diff.html${preferNative}`, {waitUntil: ['networkidle0', 'load']});
				await page.bringToFront();
			});

			beforeEach(async() => {
				await page.reload();
			});

			[
				{ category: 'wide', viewport: { width: 800, height: 500 } },
				{ category: 'narrow', viewport: { width: 600, height: 500 } }
			].forEach((info) => {

				describe(info.category, () => {

					before(async() => {
						await page.setViewport({ width: info.viewport.width, height: info.viewport.height, deviceScaleFactor: 2 });
					});

					it('page layout', async function() {
						await helper.open(page, '#confirm');
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
					});

					it('page layout rtl', async function() {
						await helper.open(page, '#confirmRtl');
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
					});

				});

			});

			describe('internal', () => {

				before(async() => {
					await page.setViewport({ width: 800, height: 500, deviceScaleFactor: 2 });
				});

				[
					{ name: 'short', selector: '#confirm' },
					{ name: 'long title', selector: '#confirmLongTitle' },
					{ name: 'no title', selector: '#confirmNoTitle' },
					{ name: 'long text', selector: '#confirmLongText' },
					{ name: 'long buttons', selector: '#confirmLongButtons' }
				].forEach((info) => {

					it(info.name, async function() {
						await helper.open(page, info.selector);
						const rect = await helper.getRect(page, info.selector);
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
					});

				});

			});

		});

	});

});
