import { open, reset } from './dialog-helper.js';
import puppeteer from 'puppeteer';
import VisualDiff from '@brightspace-ui/visual-diff';

describe('d2l-dialog-extended', () => {

	const visualDiff = new VisualDiff('dialog-extended', __dirname);

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
				await page.goto(`${visualDiff.getBaseUrl()}/components/dialog/test/dialog-extended.visual-diff.html${preferNative}`, { waitUntil: ['networkidle0', 'load'] });
				await page.bringToFront();
			});

			beforeEach(async() => {
				await reset(page, '#dialog');
				await reset(page, '#dialogLong');
				await reset(page, '#dialogRtl');
				await reset(page, '#dialogNoFooterContent');
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
						await open(page, '#dialog');
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
					});

					it('rtl', async function() {
						await open(page, '#dialogRtl');
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
					});

				});

			});

			describe('internal', () => {

				before(async() => {
					await page.setViewport({ width: 800, height: 500, deviceScaleFactor: 2 });
				});

				it('no footer content', async function() {
					await open(page, '#dialogNoFooterContent');
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
				});

				it('scroll bottom shadow', async function() {
					await open(page, '#dialogLong');
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
				});

				it.skip('scroll top shadow', async function() {
					page.waitForSelector('#dialogLong', { visible: true })
						.then(async(elem) => {
							await elem.$eval('#bottom', (bottom) => bottom.scrollIntoView());
						});

					await open(page, '#dialogLong');
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
				});

			});

		});

	});

});
