import puppeteer from 'puppeteer';
import { VisualDiff } from '@brightspace-ui/visual-diff';

describe('d2l-tag-list', () => {

	const visualDiff = new VisualDiff('tag-list', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser, { viewport: { width: 1200, height: 1500 } });
		await page.goto(`${visualDiff.getBaseUrl()}/components/tag-list/test/tag-list.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	beforeEach(async() => {
		await visualDiff.resetFocus(page);
	});

	after(async() => await browser.close());

	it(`is correct at 1200px width`, async function() {
		const rect = await visualDiff.getRect(page, '#default');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	[1000, 969, 601, 599, 400, 320].forEach((width) => {
		afterEach(async() => {
			await page.$eval('#default', (elem) => {
				const button = elem.shadowRoot.querySelector('.d2l-tag-list-button[text="Show Less"]');
				if (button) button.click();
			});
		});

		it(`is correct at ${width}px width`, async function() {
			await page.$eval('#default', async(elem, width) => {
				elem.parentNode.style.width = `${width}px`;
				await elem.updateComplete;
			}, width);
			await page.waitForTimeout(100);
			const rect = await visualDiff.getRect(page, '#default');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it(`is correct when show more button clicked at ${width}px width if applicable`, async function() {
			await page.$eval('#default', (elem) => {
				const button = elem.shadowRoot.querySelector('.d2l-tag-list-button');
				if (button) button.click();
			});
			await page.waitForTimeout(100);
			const rect = await visualDiff.getRect(page, '#default');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

});
