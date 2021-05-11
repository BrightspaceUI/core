import puppeteer from 'puppeteer';
import VisualDiff from '@brightspace-ui/visual-diff';

async function getRect(page, id) {
	return await page.$eval('d2l-test-table-visual-diff', (wrapper, id) => {
		const elem = wrapper.shadowRoot.querySelector(`#${id}`);
		const leftMargin = (elem.offsetLeft < 10 ? 0 : 10);
		const topMargin = (elem.offsetTop < 10 ? 0 : 10);
		return {
			x: elem.offsetLeft - leftMargin,
			y: elem.offsetTop - topMargin,
			width: elem.offsetWidth + (leftMargin * 2),
			height: elem.offsetHeight + (topMargin * 2)
		};
	}, id);
}

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

					before(async() => {
						await page.goto(
							`${visualDiff.getBaseUrl()}/components/table/test/table.visual-diff.html?dir=${dir}&type=${type}`,
							{ waitUntil: ['networkidle0', 'load'] }
						);
						await page.bringToFront();
					});

					describe('nonstick', () => {

						before(async() => {
							await page.$eval('d2l-test-table-visual-diff', elem => elem.removeAttribute('hidden'));
							await page.$eval('d2l-test-table-sticky-visual-diff', elem => elem.setAttribute('hidden', 'hidden'));
						});

						[
							'standard-thead',
							'standard-no-thead-class',
							'standard-no-thead-attr',
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
							'no-column-border',
							'no-column-border-legacy',
							'col-sort-button'
						].forEach((id) => {
							it(id, async function() {
								const rect = await getRect(page, id);
								await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
							});
						});

						it('overflow-scrolled', async function() {
							await page.$eval('d2l-test-table-visual-diff', (wrapper) => {
								wrapper.shadowRoot.querySelector('#overflow > table > tbody > tr.d2l-table-row-last > th')
									.scrollIntoView();
							});
							await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
						});

						it('col-sort-button-focus', async function() {
							await page.$eval('d2l-test-table-visual-diff', (wrapper) => {
								wrapper.shadowRoot.querySelector('d2l-table-col-sort-button').focus();
							});
							const rect = await getRect(page, 'col-sort-button');
							await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
						});

					});

					describe('sticky', () => {

						before(async() => {
							await page.$eval('d2l-test-table-visual-diff', elem => elem.setAttribute('hidden', 'hidden'));
							await page.$eval('d2l-test-table-sticky-visual-diff', elem => elem.removeAttribute('hidden'));
						});

						[
							'one-row-thead',
							'one-row-no-thead-class',
							'one-row-legacy-attr',
							'multi-row-thead',
							'multi-row-no-thead-class',
							'multi-row-legacy-attr',
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

					});

				});
			});
		});
	});

});
