import puppeteer from 'puppeteer';
import { VisualDiff } from '@brightspace-ui/visual-diff';

describe('d2l-filter-tags', () => {
	const visualDiff = new VisualDiff('filter-tags', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser, { viewport: { width: 1500, height: 800 } });
		await page.goto(`${visualDiff.getBaseUrl()}/components/filter/test/filter-tags.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	beforeEach(async() => {
		await visualDiff.resetFocus(page);
	});

	after(async() => await browser.close());

	it('two-filters is correct', async function() {
		const rect = await visualDiff.getRect(page, '#two-filters');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { captureBeyondViewport: false, clip: rect });
	});

	[1500, 980, 969, 601, 599, 400, 320].forEach((width) => {
		describe(`basic at width ${width}`, () => {
			const selector = '#basic';

			before(async() => {
				await page.$eval(selector, async(elem, width) => {
					elem.parentNode.style.width = `${width + 140}px`; // account for label
					const filterTags = elem.querySelector('d2l-filter-tags');
					const tagList = filterTags.shadowRoot.querySelector('d2l-tag-list');
					tagList._showHiddenTags = false;
					await elem.updateComplete;
				}, width);
				await page.waitForTimeout(500);
			});

			it('is correct', async function() {
				const rect = await visualDiff.getRect(page, selector);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { captureBeyondViewport: false, clip: rect });
			});

			it('is correct when show more button clicked if applicable', async function() {
				await page.$eval(selector, async(elem) => {
					const filterTags = elem.querySelector('d2l-filter-tags');
					const tagList = filterTags.shadowRoot.querySelector('d2l-tag-list');
					const button = tagList.shadowRoot.querySelector('.d2l-tag-list-button');
					if (button) button.click();
					await tagList.updateComplete;
					await elem.updateComplete;
				});
				await page.waitForTimeout(500);
				const rect = await visualDiff.getRect(page, selector);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { captureBeyondViewport: false, clip: rect });
			});

		});
	});

	describe('clearable behavior', () => {
		const selector = '#basic';

		before(async() => {
			await page.$eval(selector, async(elem) => {
				elem.parentNode.style.width = '1500px';
				elem._showHiddenTags = false;
				await elem.updateComplete;
			});
			await page.waitForTimeout(2000);
		});

		it('is correct when deleting the last item', async function() {
			await page.$eval(selector, (elem) => {
				const filterTags = elem.querySelector('d2l-filter-tags');
				const items = filterTags.shadowRoot.querySelectorAll('d2l-tag-list-item');
				const deleteButton = items[6].shadowRoot.querySelector('d2l-button-icon');
				deleteButton.click();
			});
			await page.waitForTimeout(500);
			const rect = await visualDiff.getRect(page, selector);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { captureBeyondViewport: false, clip: rect });
		});

		it('is correct when deleting second item', async function() {
			await page.keyboard.press('Tab');
			await page.keyboard.press('Tab');
			await page.keyboard.press('ArrowRight');
			await page.keyboard.press('Delete');
			await page.waitForTimeout(500);
			const rect = await visualDiff.getRect(page, selector);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { captureBeyondViewport: false, clip: rect });
		});

		it('is correct after clicking Clear All', async function() {
			await page.$eval(selector, async(elem) => {
				const filterTags = elem.querySelector('d2l-filter-tags');
				const tagList = filterTags.shadowRoot.querySelector('d2l-tag-list');
				await tagList.updateComplete;
				tagList.shadowRoot.querySelector('d2l-button-subtle.d2l-tag-list-clear-button').click();
			});
			const rect = await visualDiff.getRect(page, selector);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { captureBeyondViewport: false, clip: rect });
		});

	});

});
