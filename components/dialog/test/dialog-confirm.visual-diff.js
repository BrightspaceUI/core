import { getRect, open, reset } from './dialog-helper.js';
import puppeteer from 'puppeteer';
import VisualDiff from '@brightspace-ui/visual-diff';

describe('d2l-dialog-confirm', () => {

	const visualDiff = new VisualDiff('dialog-confirm', import.meta.url);

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
				await page.goto(`${visualDiff.getBaseUrl()}/components/dialog/test/dialog-confirm.visual-diff.html${preferNative}`, { waitUntil: ['networkidle0', 'load'] });
				await page.bringToFront();
			});

			beforeEach(async() => {
				await reset(page, '#confirm');
				await reset(page, '#confirmLongTitle');
				await reset(page, '#confirmNoTitle');
				await reset(page, '#confirmLongText');
				await reset(page, '#confirmLongButtons');
				await reset(page, '#confirmRtl');
				await reset(page, '#confirmMultiParagraph');
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
						await open(page, '#confirm');
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { captureBeyondViewport: false });
					});

					it('rtl', async function() {
						await open(page, '#confirmRtl');
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { captureBeyondViewport: false });
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
					{ name: 'long buttons', selector: '#confirmLongButtons' },
					{ name: 'multiple paragraphs', selector: '#confirmMultiParagraph' }
				].forEach((info) => {

					it(info.name, async function() {
						await open(page, info.selector);
						const rect = await getRect(page, info.selector);
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { captureBeyondViewport: false, clip: rect });
					});

				});

			});

		});

	});

});
