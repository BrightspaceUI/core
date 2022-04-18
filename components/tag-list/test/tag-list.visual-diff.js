import puppeteer from 'puppeteer';
import { VisualDiff } from '@brightspace-ui/visual-diff';

describe('d2l-tag-list', () => {
	const visualDiff = new VisualDiff('tag-list', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser, { viewport: { width: 1200, height: 800 } });
		await page.goto(`${visualDiff.getBaseUrl()}/components/tag-list/test/tag-list.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	beforeEach(async() => {
		await visualDiff.resetFocus(page);
	});

	after(async() => await browser.close());

	it('is correct at 1200px width', async function() {
		const rect = await visualDiff.getRect(page, '#default');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	[980, 969, 601, 599, 400, 320].forEach((width) => {
		['default', 'clearable'].forEach((state) => {
			describe(`${state} at width ${width}`, () => {
				const selector = `#${state}`;

				before(async() => {
					await page.$eval(selector, async(elem, width) => {
						elem.parentNode.style.width = `${width}px`;
						elem._showHiddenTags = false;
						await elem.updateComplete;
					}, width);
					await page.waitForTimeout(500);
				});

				it('is correct', async function() {
					const rect = await visualDiff.getRect(page, selector);
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});

				it('is correct after adding items', async function() {
					await page.$eval(selector, async(elem) => {
						for (let i = 0; i < 2; i++) {
							const tag = document.createElement('d2l-tag-list-item');
							tag.text = 'Added New Item';
							elem.insertBefore(tag, elem.children[0]);
						}
						await elem.updateComplete;
					});
					await page.waitForTimeout(500);
					const rect = await visualDiff.getRect(page, selector);
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});

				it('is correct when show more button clicked if applicable', async function() {
					await page.$eval(selector, async(elem) => {
						for (let i = 0; i < 2; i++) {
							if (elem.children[0].text === 'Added New Item') elem.removeChild(elem.children[0]);
						}
						await elem.updateComplete;
						const button = elem.shadowRoot.querySelector('.d2l-tag-list-button');
						if (button) button.click();
						await elem.updateComplete;
					});
					await page.waitForTimeout(500);
					const rect = await visualDiff.getRect(page, selector);
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});

			});
		});
	});

	describe('clearable behavior', () => {
		const selector = '#clearable';

		before(async() => {
			await page.$eval(selector, async(elem) => {
				elem.parentNode.style.width = '1200px';
				elem._showHiddenTags = false;
				await elem.updateComplete;
			});
			await page.waitForTimeout(2000);
		});

		it('is correct when deleting the last item', async function() {
			await page.$eval(selector, (elem) => {
				const firstItem = elem.children[4];
				const deleteButton = firstItem.shadowRoot.querySelector('d2l-button-icon');
				deleteButton.click();
			});
			await page.waitForTimeout(500);
			const rect = await visualDiff.getRect(page, selector);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('is correct when deleting first item', async function() {
			const openEvent = page.$eval(selector, (elem) => {
				return new Promise((resolve) => {
					const tooltip = elem.children[1].shadowRoot.querySelector('d2l-tooltip');
					tooltip.addEventListener('d2l-tooltip-show', resolve, { once: true });
				});
			});
			await page.$eval(selector, async(elem) => {
				const firstItem = elem.children[0];
				const deleteButton = firstItem.shadowRoot.querySelector('d2l-button-icon');
				deleteButton.click();
			});
			await openEvent;
			const rect = await visualDiff.getRect(page, selector);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('is correct after clicking Clear All', async function() {
			await page.$eval(selector, (elem) => elem.shadowRoot.querySelector('d2l-button-subtle.d2l-tag-list-clear-button').click());
			await page.waitForTimeout(500);
			const rect = await visualDiff.getRect(page, selector);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

	});

});
