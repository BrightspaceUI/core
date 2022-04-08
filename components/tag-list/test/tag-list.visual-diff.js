import puppeteer from 'puppeteer';
import { VisualDiff } from '@brightspace-ui/visual-diff';


describe.only('d2l-tag-list', () => {
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

	it('is correct at 1200px width', async function() {
		const rect = await visualDiff.getRect(page, '#default');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	[980, 969, 601, 599, 400, 320].forEach((width) => {
		describe(`at width ${width}`, () => {
			before(async() => {
				await page.$eval('#default', async(elem, width) => {
					elem.parentNode.style.width = `${width}px`;
					elem._showHiddenTags = false;
					await elem.updateComplete;
				}, width);
				await page.waitForTimeout(2000);
			});

			it(`is correct`, async function() {
				const rect = await visualDiff.getRect(page, '#default');
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it(`is correct after adding items`, async function() {
				await page.$eval('#default', (elem) => {
					for (let i = 0; i < 2; i++) {
						const tag = document.createElement('d2l-tag-list-item');
						tag.text = 'Added New Item';
						document.querySelector('d2l-tag-list').insertBefore(tag, elem.children[0]);
					}
				});
				await page.waitForTimeout(2000);
				const rect = await visualDiff.getRect(page, '#default');
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it(`is correct when show more button clicked if applicable`, async function() {
				await page.$eval('#default', async(elem) => {
					for (let i = 0; i < 2; i++) {
						if (elem.children[0].text === 'Added New Item') elem.removeChild(elem.children[0]);
					}
					await elem.updateComplete;
					const button = elem.shadowRoot.querySelector('.d2l-tag-list-button');
					if (button) button.click();
				});
				await page.waitForTimeout(2000);
				const rect = await visualDiff.getRect(page, '#default');
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

		});
	});

});
