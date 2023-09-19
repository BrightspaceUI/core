import puppeteer from 'puppeteer';
import { VisualDiff } from '@brightspace-ui/visual-diff';

describe('d2l-table', () => {

	const visualDiff = new VisualDiff('table', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);
		await page.setViewport({ width: 500, height: 300, deviceScaleFactor: 2 });
	});

	after(async() => await browser.close());

	beforeEach(async() => {
		await page.evaluate(() => window.scrollTo(0, 0));
	});

	['ltr', 'rtl'].forEach((dir) => {
		describe(dir, () => {
			['default', 'light'].forEach((type) => {
				describe(type, () => {

					before(async() => {
						await page.goto(
							`${visualDiff.getBaseUrl()}/components/table/test/table.visual-diff.html?dir=${dir}&type=${type}`,
							{ waitUntil: ['networkidle0', 'load'] }
						);
						await page.bringToFront();
					});

					describe('sticky', () => {

						[
							'one-row-thead',
							'one-row-no-thead-class',
							'one-row-no-thead-attr',
							'multi-row-thead',
							'multi-row-no-thead-class',
							'multi-row-no-thead-attr',
							'selected-one-row',
							'selected-top-bottom',
							'selected-all',
							'fixed-column-class',
							'fixed-column-attr',
							'one-column',
						].forEach((id) => {
							['top', 'down', 'over'].forEach((position) => {
								it(`${id}-${position}`, async function() {
									await page.$eval('d2l-test-table-sticky-visual-diff', (wrapper, id, position) => {
										wrapper.shadowRoot.querySelector(`#${id} .${position}`).scrollIntoView();
									}, id, position);
									await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
								});
							});
						});

						[
							'grades-row-header',
							'grades-column-header'
						].forEach((id) => {
							['top', 'over'].forEach((position) => {
								it(`${id}-${position}`, async function() {
									await page.evaluate(() => window.scrollTo(0, 0));
									await page.$eval('d2l-test-table-sticky-visual-diff', (wrapper, id, position) => {
										wrapper.shadowRoot.querySelector(`#${id} .${position}`).scrollIntoView();
									}, id, position);
									await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
								});
							});
						});

					});
				});
			});
		});
	});

});
