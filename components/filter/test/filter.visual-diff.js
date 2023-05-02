import { getRect, open, reset, show } from './filter-helper.js';
import puppeteer from 'puppeteer';
import VisualDiff from '@brightspace-ui/visual-diff';

describe('d2l-filter', () => {

	const visualDiff = new VisualDiff('filter', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch({ headless: 'new' });
		page = await visualDiff.createPage(browser, { viewport: { width: 800, height: 1500 } });
	});

	after(async() => await browser.close());

	describe('ltr', () => {
		before(async() => {
			await page.goto(`${visualDiff.getBaseUrl()}/components/filter/test/filter.visual-diff.html?dir=ltr`, { waitUntil: ['networkidle0', 'load'] });
			await page.bringToFront();
		});

		describe('opener', () => {
			it('disabled', async function() {
				const rect = await visualDiff.getRect(page, '#disabled');
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			[ 'single', 'multiple', 'multiple-text-override' ].forEach(type => {
				it(`${type}-over-99`, async function() {
					const selector = `#${type}-closed`;
					await page.$eval(selector, async(filter) => {
						filter._totalAppliedCount = 100;
						await filter.updateComplete;
					});

					const rect = await visualDiff.getRect(page, selector);
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});
			});
		});

		describe('single-set', () => {
			afterEach(async function() {
				await reset(page, `#single-set-${this.currentTest.title}`);
			});

			[
				'empty',
				'custom-empty',
				'introductory-text',
				'single-selection',
				'single-selection-select-all',
				'multi-selection',
				'multi-selection-no-search',
				'multi-selection-no-search-select-all',
				'multi-selection-all-selected'
			].forEach(type => {
				it(type, async function() {
					const selector = `#single-set-${type}`;
					await open(page, selector);
					const rect = await getRect(page, selector);
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { captureBeyondViewport: false, clip: rect });
				});
			});

			describe('searched', () => {
				afterEach(async function() {
					const selector = `#single-set-${this.currentTest.title}`;
					await page.$eval(selector, (filter) => {
						filter._handleSearch({ detail: { value: '' } });
					});
				});

				[
					{ selector: 'single-selection', search: 'empty' },
					{ selector: 'single-selection-select-all', search: 'w' },
					{ selector: 'multi-selection', search: 'empty' },
					{ selector: 'multi-selection-all-selected', search: 'st' }
				].forEach(info => {
					it(info.selector, async function() {
						const selector = `#single-set-${info.selector}`;
						await page.$eval(selector, (filter, searchValue) => {
							filter._handleSearch({ detail: { value: searchValue } });
						}, info.search);
						await open(page, selector);
						const rect = await getRect(page, selector);
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { captureBeyondViewport: false, clip: rect });
					});
				});
			});

			it('press-clear', async function() {
				const selector = '#single-set-press-clear';
				await open(page, selector);
				await page.$eval(selector, async(filter) => {
					filter.shadowRoot.querySelector('d2l-button-subtle').click();
					await new Promise(resolve => requestAnimationFrame(resolve));
				});
				const rect = await getRect(page, selector);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { captureBeyondViewport: false, clip: rect });
			});

			[
				'press-unselect-all',
				'press-select-all'
			].forEach(type => {
				it(type, async function() {
					const selector = `#single-set-${type}`;
					await open(page, selector);
					await page.$eval(selector, async(filter, type) => {
						const checkbox = filter.shadowRoot.querySelector('d2l-selection-select-all').shadowRoot.querySelector('d2l-input-checkbox');
						if ((type === 'press-unselect-all' && checkbox.checked)
							|| (type === 'press-select-all' && !checkbox.checked)
						) {
							// NOT visual-diff retry
							checkbox.shadowRoot.querySelector('input').click();
						}
						await new Promise(resolve => requestAnimationFrame(resolve));
					}, type);
					const rect = await getRect(page, selector);
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { captureBeyondViewport: false, clip: rect });
				});
			});
		});

		describe('multiple', () => {
			describe('list', () => {
				afterEach(async function() {
					await reset(page, `#multiple-${this.currentTest.title}`);
				});

				[
					'empty',
					'selected'
				].forEach(type => {
					it(type, async function() {
						const selector = `#multiple-${type}`;
						await open(page, selector);
						const rect = await getRect(page, selector);
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { captureBeyondViewport: false, clip: rect });
					});
				});

				it('press-clear-all', async function() {
					const selector = '#multiple-press-clear-all';
					await open(page, selector);
					await page.$eval(selector, async(filter) => {
						filter.shadowRoot.querySelector('d2l-button-subtle').click();
						await new Promise(resolve => requestAnimationFrame(resolve));
					});
					const rect = await getRect(page, selector);
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { captureBeyondViewport: false, clip: rect });
				});
			});

			describe('nested-dim', () => {
				afterEach(async() => {
					await reset(page, '#multiple-selected');
				});

				for (let i = 1; i <= 3; i++) {
					it(i.toString(), async function() {
						const selector = '#multiple-selected';
						await open(page, selector);
						await show(page, selector, i - 1);
						const rect = await getRect(page, selector);
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { captureBeyondViewport: false, clip: rect });
					});
				}
			});
		});

		describe('mobile', () => {
			before(async() => {
				await page.setViewport({ width: 600, height: 500, deviceScaleFactor: 2 });
			});

			afterEach(async function() {
				await reset(page, `#${this.currentTest.title}`);
			});

			[
				/*'single-set-empty', // flaky */
				'single-set-introductory-text',
				'single-set-single-selection',
				'single-set-single-selection-select-all',
				'single-set-multi-selection',
				'single-set-multi-selection-no-search',
				'single-set-multi-selection-no-search-select-all',
				'single-set-multi-selection-all-selected',
				'multiple-empty',
				'multiple-selected'
			].forEach(type => {
				it(type, async function() {
					const selector = `#${type}`;
					await open(page, selector);
					page.waitForTimeout(50);
					await page.$eval (selector, async(elem)  => {
						window.scrollTo(0, 0);
						requestAnimationFrame(async() => await elem.updateComplete);
					});
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { captureBeyondViewport: false });
				});
			});

			for (let i = 1; i <= 3; i++) {
				describe(`nested-dim-${i}`, () => {
					it('multiple-selected', async function() {
						const selector = '#multiple-selected';
						await open(page, selector);
						await show(page, selector, i - 1);
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { captureBeyondViewport: false });
					});
				});
			}
		});

	});

	describe('rtl', () => {
		before(async() => {
			await page.goto(`${visualDiff.getBaseUrl()}/components/filter/test/filter.visual-diff.html?dir=rtl`, { waitUntil: ['networkidle0', 'load'] });
			await page.setViewport({ width: 800, height: 1500, deviceScaleFactor: 2 });
			await page.bringToFront();
		});

		describe('opener', () => {
			after(async() => {
				await page.reload({ waitUntil: ['networkidle0', 'load'] });
			});

			it('multiple-over-99', async function() {
				const selector = '#multiple-closed';
				await page.$eval(selector, async(filter) => {
					await new Promise((resolve) => {
						filter.addEventListener('d2l-localize-resources-change', resolve, { once: true });
						if (document.querySelector('html').getAttribute('lang') !== 'ar') {
							document.querySelector('html').setAttribute('lang', 'ar');
						}
						else {
							resolve();
						}
					});
					filter._totalAppliedCount = 100;
					await filter.updateComplete;
				});

				const rect = await visualDiff.getRect(page, selector);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});
		});

		describe('single-set', () => {
			afterEach(async function() {
				await reset(page, `#single-set-${this.currentTest.title}`);
			});

			[
				'introductory-text',
				'single-selection-select-all',
				'multi-selection-no-search',
				'multi-selection-no-search-select-all',
				'multi-selection-all-selected'
			].forEach(type => {
				it(type, async function() {
					const selector = `#single-set-${type}`;
					await open(page, selector);
					const rect = await getRect(page, selector);
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { captureBeyondViewport: false, clip: rect });
				});
			});
		});

		describe('multiple', () => {
			describe('list', () => {
				afterEach(async function() {
					await reset(page, `#multiple-${this.currentTest.title}`);
				});

				[
					'empty',
					'selected'
				].forEach(type => {
					it(type, async function() {
						const selector = `#multiple-${type}`;
						await open(page, selector);
						const rect = await getRect(page, selector);
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { captureBeyondViewport: false, clip: rect });
					});
				});
			});

			describe('nested-dim', () => {
				afterEach(async() => {
					await reset(page, '#multiple-selected');
				});

				for (let i = 1; i <= 3; i++) {
					it(i.toString(), async function() {
						const selector = '#multiple-selected';
						await open(page, selector);
						await show(page, selector, i - 1);
						const rect = await getRect(page, selector);
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { captureBeyondViewport: false, clip: rect });
					});
				}
			});
		});

		describe('mobile', () => {
			before(async() => {
				await page.setViewport({ width: 600, height: 500, deviceScaleFactor: 2 });
			});

			afterEach(async function() {
				await reset(page, `#${this.currentTest.title}`);
			});

			[
				'single-set-introductory-text',
				'single-set-single-selection-select-all',
				'single-set-multi-selection-no-search',
				'single-set-multi-selection-no-search-select-all',
				'single-set-multi-selection-all-selected',
				'multiple-empty',
				'multiple-selected'
			].forEach(type => {
				it(type, async function() {
					const selector = `#${type}`;
					await open(page, selector);
					page.waitForTimeout(50);
					await page.$eval (selector, async(elem)  => {
						requestAnimationFrame(async() => await elem.updateComplete);
					});
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { captureBeyondViewport: false });
				});
			});

			for (let i = 1; i <= 3; i++) {
				describe(`nested-dim-${i}`, () => {
					it('multiple-selected', async function() {
						const selector = '#multiple-selected';
						await open(page, selector);
						await show(page, selector, i - 1);
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { captureBeyondViewport: false });
					});
				});
			}
		});

	});

});
