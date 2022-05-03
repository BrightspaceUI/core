import { open, reset } from './dialog-helper.js';
import puppeteer from 'puppeteer';
import VisualDiff from '@brightspace-ui/visual-diff';

describe('d2l-dialog-fullscreen', () => {

	const visualDiff = new VisualDiff('dialog-fullscreen', import.meta.url);

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
				await reset(page, '#dialog');
				await reset(page, '#dialogLong');
				await reset(page, '#dialogRtl');
				await reset(page, '#dialogNoFooterContent');
				await reset(page, '#dialogHorizontalOverflow');
			});

			[
				{ category: 'wide', viewport: { width: 800, height: 500 } },
				{ category: 'narrow', viewport: { width: 600, height: 500 } },
				{ category: 'landscape', viewport: { width: 600, height: 320 } },
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

				it('horizontal overflow', async function() {
					await open(page, '#dialogHorizontalOverflow');
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
				});

				it('scroll bottom shadow', async function() {
					await open(page, '#dialogLong');
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
				});

				it('scroll top shadow', async function() {
					await open(page, '#dialogLong');
					await new Promise(resolve => setTimeout(resolve, 50));
					await page.$eval('#dialogLong', (dialog) => {
						dialog.shadowRoot.querySelector('.d2l-dialog-content').scrollTop = 500;
					});
					await new Promise(resolve => setTimeout(resolve, 50));
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
