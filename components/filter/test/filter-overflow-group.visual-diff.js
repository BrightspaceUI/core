import puppeteer from 'puppeteer';
import VisualDiff from '@brightspace-ui/visual-diff';

describe('d2l-filter-overflow-group', () => {

	const visualDiff = new VisualDiff('filter-overflow-group', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch({ headless: 'new' });
		page = await visualDiff.createPage(browser);
		await page.goto(`${visualDiff.getBaseUrl()}/components/filter/test/filter-overflow-group.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	after(async() => await browser.close());

	[
		'more-than-max-to-show',
		'one-more-than-max-to-show',
		'less-than-min-to-show',
		'between-min-max-to-show',
		'exactly-max-to-show',
		'ignores-hidden-filter',
		'small-width'
	].forEach((test) => {
		it(test, async function() {
			const containerSelector = `#${test}-container`;
			await page.$eval(containerSelector, (elem) => elem.scrollIntoView());
			const rect = await visualDiff.getRect(page, containerSelector);
			await visualDiff.screenshotAndCompare(page, `${this.test.fullTitle()}`, { captureBeyondViewport: false, clip: rect });
		});
	});

	[700, 400, 320, 500].forEach((width) => {
		describe(`basic at width ${width}`, () => {
			const selector = '#basic';

			before(async() => {
				await page.$eval(selector, async(elem, width) => {
					elem.parentNode.style.width = `${width}px`;
					await elem.updateComplete;
				}, width);
				await page.waitForTimeout(200);
			});

			it('is correct', async function() {
				const rect = await visualDiff.getRect(page, selector);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { captureBeyondViewport: false, clip: rect });
			});
		});

		describe(`tags at width ${width}`, () => {
			const selector = '#tags';

			before(async() => {
				await page.$eval(selector, async(elem, width) => {
					elem.parentNode.style.width = `${width}px`;
					await elem.updateComplete;
				}, width);
				await page.waitForTimeout(200);
			});

			it('is correct', async function() {
				const rect = await visualDiff.getRect(page, `${selector}-container`);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { captureBeyondViewport: false, clip: rect });
			});
		});
	});

	it('click dropdown opener', async function() {
		const overflowContainer = await page.evaluateHandle(
			'document.querySelector("#more-than-max-to-show").shadowRoot.querySelector(".d2l-overflow-container")'
		);
		await overflowContainer.click();
		const rect = await visualDiff.getRect(page, '#more-than-max-to-show-container');
		rect.height += 200;
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { captureBeyondViewport: false, clip: rect });
	});
});
