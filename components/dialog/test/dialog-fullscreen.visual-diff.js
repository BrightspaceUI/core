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
				const resetPromises = [
					'#dialog',
					'#dialogLong',
					'#dialogRtl',
					'#dialogNoFooterContent',
					'#dialogHorizontalOverflow',
					'#dialogSetWidth',
					'#dialogSetWidthBelowMin',
					'#dialogSetWidthAboveMax'
				].map(id => reset(page, id));

				await Promise.all(resetPromises);
			});

			[
				{ category: 'wider', viewport: { width: 1400, height: 700 } },
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
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { captureBeyondViewport: false });
					});

					it('openedSetWidth', async function() {
						await open(page, '#dialogSetWidth');
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { captureBeyondViewport: false });
					});

					it('openedSetWidthBelowMin', async function() {
						await open(page, '#dialogSetWidthBelowMin');
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { captureBeyondViewport: false });
					});

					it('openedSetWidthAboveMax', async function() {
						await open(page, '#dialogSetWidthAboveMax');
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { captureBeyondViewport: false });
					});

					it('rtl', async function() {
						await open(page, '#dialogRtl');
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { captureBeyondViewport: false });
					});

				});

			});

			describe('internal', () => {

				before(async() => {
					await page.setViewport({ width: 800, height: 500, deviceScaleFactor: 2 });
				});

				it('no footer content', async function() {
					await open(page, '#dialogNoFooterContent');
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { captureBeyondViewport: false });
				});

				it('horizontal overflow', async function() {
					await open(page, '#dialogHorizontalOverflow');
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { captureBeyondViewport: false });
				});

				it('scroll bottom shadow', async function() {
					await open(page, '#dialogLong');
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { captureBeyondViewport: false });
				});

				it('scroll top shadow', async function() {
					await open(page, '#dialogLong');
					await page.$eval('#dialogLong #bottom', (bottom) => {
						bottom.scrollIntoView();
					});
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { captureBeyondViewport: false });
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
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { captureBeyondViewport: false });
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
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { captureBeyondViewport: false });
				});

			});

		});

	});

});
