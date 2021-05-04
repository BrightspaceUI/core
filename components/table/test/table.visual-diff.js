import puppeteer from 'puppeteer';
import VisualDiff from '@brightspace-ui/visual-diff';

describe('d2l-table', () => {

	const visualDiff = new VisualDiff('table', __dirname);

	let browser, page;
	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);
		await page.setViewport({ width: 500, height: 300, deviceScaleFactor: 2 });
	});

	after(async() => await browser.close());

	['ltr', 'rtl'].forEach((dir) => {
		describe(dir, () => {
			['default', 'light'].forEach((type) => {
				describe(type, () => {

					describe('nonstick', () => {

						before(async() => {
							await page.goto(
								`${visualDiff.getBaseUrl()}/components/table/test/table.visual-diff.html?dir=${dir}&type=${type}`,
								{ waitUntil: ['networkidle0', 'load'] }
							);
							await page.bringToFront();
						});

						[
							'standard-thead',
							'standard-no-thead',
							'vertical-align',
							'empty',
							'one-column',
							'one-cell',
							'no-header-tbody',
							'no-header-no-tbody',
							'rowspan',
							'footer',
							'selected-one-row',
							'selected-top-bottom',
							'selected-all',
							'overflow',
							'no-column-border'
						].forEach((id) => {
							it(id, async function() {
								const rect = await visualDiff.getRect(page, `#${id}`);
								await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
							});
						});

						it('overflow-scrolled', async function() {
							await page.$eval('#overflow > table > tbody > tr.d2l-table-row-last > th', (elem) => elem.scrollIntoView());
							await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
						});

					});

					describe('sticky', () => {

						before(async() => {
							await page.goto(
								`${visualDiff.getBaseUrl()}/components/table/test/table.sticky.visual-diff.html?dir=${dir}&type=${type}`,
								{ waitUntil: ['networkidle0', 'load'] }
							);
							await page.bringToFront();
						});

						[
							'one-row-thead',
							'one-row-no-thead',
							'multi-row-thead',
							'multi-row-no-thead',
							'selected-one-row',
							'selected-top-bottom',
							'selected-all',
							'fixed-column',
							'one-column',
						].forEach((id) => {
							['top', 'down', 'over'].forEach((position) => {
								it(`${id}-${position}`, async function() {
									await page.$eval(`#${id} .${position}`, (elem) => elem.scrollIntoView());
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
