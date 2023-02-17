import puppeteer from 'puppeteer';
import VisualDiff from '@brightspace-ui/visual-diff';

async function getRect(page, id, wrapperId) {
	return await page.$eval(wrapperId, (wrapper, id) => {
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

	const visualDiff = new VisualDiff('table', import.meta.url);

	let browser, page;

	const setProperties = (selector, properties) => {
		return page.$eval(selector, (element, properties) => {
			Object.keys(properties).forEach(key => element[key] = properties[key]);
		}, properties);
	};

	const scrollTo = (selector, y) => {
		return page.$eval(selector, (element, y) => {
			element.scrollIntoView();
			element.scrollTo(0, y);
		}, y);
	};

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
							await page.$eval('d2l-test-table-controls-visual-diff', elem => elem.setAttribute('hidden', 'hidden'));
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
								const rect = await getRect(page, id, 'd2l-test-table-visual-diff');
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
							const rect = await getRect(page, 'col-sort-button', 'd2l-test-table-visual-diff');
							await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
						});

					});

					describe('sticky', () => {

						before(async() => {
							await page.$eval('d2l-test-table-visual-diff', elem => elem.setAttribute('hidden', 'hidden'));
							await page.$eval('d2l-test-table-sticky-visual-diff', elem => elem.removeAttribute('hidden'));
							await page.$eval('d2l-test-table-controls-visual-diff', elem => elem.setAttribute('hidden', 'hidden'));
						});

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

					});

					describe('table-controls', () => {

						before(async() => {
							await page.$eval('d2l-test-table-visual-diff', elem => elem.setAttribute('hidden', 'hidden'));
							await page.$eval('d2l-test-table-sticky-visual-diff', elem => elem.setAttribute('hidden', 'hidden'));
							await page.$eval('d2l-test-table-controls-visual-diff', elem => elem.removeAttribute('hidden'));
						});

						[
							{ name: 'no-sticky', action: () => setProperties('pierce/#table-controls > d2l-test-table', { stickyControls: false, stickyHeaders: false, visibleBackground: false }) },
							{ name: 'sticky-controls', action: () => setProperties('pierce/#table-controls > d2l-test-table', { stickyControls: true, stickyHeaders: false, visibleBackground: false }) },
							{ name: 'all-sticky', action: () => setProperties('pierce/#table-controls > d2l-test-table', { stickyControls: true, stickyHeaders: true, visibleBackground: false }) },
							{ name: 'visible-background', action: () => setProperties('pierce/#table-controls > d2l-test-table', { stickyControls: true, stickyHeaders: true, visibleBackground: true }) },
						].forEach(condition1 => {
							describe(condition1.name, () => {

								before(condition1.action);

								[
									{ name: '1-top', action: () => scrollTo('pierce/#table-controls', 0) },
									{ name: '2-scrolled', action: () => scrollTo('pierce/#table-controls', 1000) },
								].forEach(condition2 => {
									it(condition2.name, async function() {
										await condition2.action();
										const rect = await getRect(page, 'table-controls', 'd2l-test-table-controls-visual-diff');
										await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
									});
								});

							});
						});

					});

				});
			});
		});
	});

});
