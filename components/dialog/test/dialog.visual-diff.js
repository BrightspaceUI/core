import { open, reset } from './dialog-helper.js';
import puppeteer from 'puppeteer';
import VisualDiff from '@brightspace-ui/visual-diff';

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
				await page.goto(`${visualDiff.getBaseUrl()}/components/dialog/test/dialog.visual-diff.html${preferNative}`, { waitUntil: ['networkidle0', 'load'] });
				await page.bringToFront();
			});

			beforeEach(async() => {
				await reset(page, '#dialog');
				await reset(page, '#dialogLong');
				await reset(page, '#dialogRtl');
				await reset(page, '#dialogResize');
				await reset(page, '#dialogNoFooterContent');
			});

			[
				{ category: 'tall-wide', viewport: { width: 800, height: 500 } },
				{ category: 'tall-narrow', viewport: { width: 600, height: 500 } },
				{ category: 'short-wide', viewport: { width: 910, height: 400 } },
				{ category: 'short-narrow', viewport: { width: 890, height: 400 } }
			].forEach((info) => {

				describe(info.category, () => {

					before(async() => {
						await page.setViewport({ width: info.viewport.width, height: info.viewport.height, deviceScaleFactor: 2 });
					});

					it('opened', async function() {
						await open(page, '#dialog');
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
					});

					it('opened-wide', async function() {
						await page.$eval('#wideContainer', wideContainer => wideContainer.style.width = '1500px');
						await open(page, '#dialog');
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
						await page.$eval('#wideContainer', wideContainer => wideContainer.style.width = 'auto');
					});

					it('rtl', async function() {
						await open(page, '#dialogRtl');
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
					});

					it('resize', async function() {
						await open(page, '#dialogResize');
						await page.$eval('#dialogResize', (dialog) => {
							dialog.querySelector('div').style.height = '60px';
							dialog.width = 500;
							dialog.resize();
						});
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

				it('scroll top shadow', async function() {
					await open(page, '#dialogLong');
					await page.$eval('#dialogLong #bottom', (bottom) => {
						bottom.scrollIntoView();
					});
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
				});

				it('fullscreen-within-on', async function() {
					await open(page, '#dialog');
					page.$eval('#top', childElem => {
						childElem.dispatchEvent(new CustomEvent(
							'd2l-fullscreen-within', {
								bubbles: true,
								composed: true,
								detail: { 'state': true }
							}
						));
					});
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
				});

				it('fullscreen-within-off', async function() {
					await open(page, '#dialog');
					page.$eval('#top', childElem => {
						childElem.dispatchEvent(new CustomEvent(
							'd2l-fullscreen-within', {
								bubbles: true,
								composed: true,
								detail: { 'state': true }
							}
						));
						requestAnimationFrame(() => {
							childElem.dispatchEvent(new CustomEvent(
								'd2l-fullscreen-within', {
									bubbles: true,
									composed: true,
									detail: { 'state': false }
								}
							));
						});
					});
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
				});

			});

		});

	});

});
