import { open, openDropdown, openFilter, reset, resetDropdown, resetFilter } from './dialog-helper.js';
import puppeteer from 'puppeteer';
import VisualDiff from '@brightspace-ui/visual-diff';

describe('d2l-dialog-with-mobile-dropdown', () => {

	const visualDiff = new VisualDiff('dialog-mobile-dropdown', import.meta.url);

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
				await page.goto(`${visualDiff.getBaseUrl()}/components/dialog/test/dialog-mobile-dropdown.visual-diff.html${preferNative}`, { waitUntil: ['networkidle0', 'load'] });
				await page.bringToFront();
			});

			beforeEach(async() => {
				await resetDropdown(page, '#dialog .left');
				await resetDropdown(page, '#dialog .bottom');
				await resetFilter(page, '#dialog d2l-filter');
				await reset(page, '#dialog');
				await resetDropdown(page, '#dialog-fullscreen .left');
				await resetDropdown(page, '#dialog-fullscreen .bottom');
				await resetFilter(page, '#dialog-fullscreen d2l-filter');
				await reset(page, '#dialog-fullscreen');
				await resetDropdown(page, '#dialog-nested .left');
				await resetDropdown(page, '#dialog-nested .bottom');
				await resetFilter(page, '#dialog-nested d2l-filter');
				await reset(page, '#dialog-nested-child');
				await reset(page, '#dialog-nested');
			});

			describe('default-breakpoint', () => {
				before(async() => {
					await page.setViewport({ width: 600, height: 500, deviceScaleFactor: 2 });
				});

				[
					{
						name: 'left',
						setup: async() => {
							await open(page, '#dialog');
							await openDropdown(page, '#dialog .left');
						}
					},
					{
						name: 'bottom',
						setup: async() => {
							await open(page, '#dialog');
							await openDropdown(page, '#dialog .bottom');
						}
					},
					{
						name: 'filter',
						setup: async() => {
							await open(page, '#dialog');
							await openFilter(page, '#dialog d2l-filter');
						}
					},
					{
						name: 'left-fullscreen',
						setup: async() => {
							await open(page, '#dialog-fullscreen');
							await openDropdown(page, '#dialog-fullscreen .left');
						}
					},
					{
						name: 'bottom-fullscreen',
						setup: async() => {
							await open(page, '#dialog-fullscreen');
							await openDropdown(page, '#dialog-fullscreen .bottom');
						}
					},
					{
						name: 'filter-fullscreen',
						setup: async() => {
							await open(page, '#dialog-fullscreen');
							await openFilter(page, '#dialog-fullscreen d2l-filter');
						}
					},
					{
						name: 'left-nested',
						setup: async() => {
							await open(page, '#dialog-nested');
							await open(page, '#dialog-nested-child');
							await new Promise(resolve => setTimeout(resolve, 50));
							await openDropdown(page, '#dialog-nested .left');
						}
					},
					{
						name: 'bottom-nested',
						setup: async() => {
							await open(page, '#dialog-nested');
							await open(page, '#dialog-nested-child');
							await new Promise(resolve => setTimeout(resolve, 50));
							await openDropdown(page, '#dialog-nested .bottom');
						}
					},
					{
						name: 'filter-nested',
						setup: async() => {
							await open(page, '#dialog-nested');
							await open(page, '#dialog-nested-child');
							await new Promise(resolve => setTimeout(resolve, 50));
							await openFilter(page, '#dialog-nested d2l-filter');
						}
					}
				].forEach(testCase => {
					it(testCase.name, async function() {
						await testCase.setup();
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { captureBeyondViewport: false });
					});
				});
			});

			describe('filter-breakpoint', () => {
				before(async() => {
					await page.setViewport({ width: 750, height: 500, deviceScaleFactor: 2 });
				});

				[
					{
						name: 'filter',
						setup: async() => {
							await open(page, '#dialog');
							await openFilter(page, '#dialog d2l-filter');
						}
					},
					{
						name: 'filter-fullscreen',
						setup: async() => {
							await open(page, '#dialog-fullscreen');
							await openFilter(page, '#dialog-fullscreen d2l-filter');
						}
					},
					{
						name: 'filter-nested',
						setup: async() => {
							await open(page, '#dialog-nested');
							await open(page, '#dialog-nested-child');
							await new Promise(resolve => setTimeout(resolve, 50));
							await openFilter(page, '#dialog-nested d2l-filter');
						}
					}
				].forEach(testCase => {
					it(testCase.name, async function() {
						await testCase.setup();
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { captureBeyondViewport: false });
					});
				});
			});

		});

	});

});
