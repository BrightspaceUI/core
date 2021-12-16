/*global forceFocusVisible */
import puppeteer from 'puppeteer';
import VisualDiff from '@brightspace-ui/visual-diff';

describe('d2l-count-badge', () => {

	const visualDiff = new VisualDiff('count-badge', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);
		await page.goto(`${visualDiff.getBaseUrl()}/components/count-badge/test/count-badge.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	async function getRect(page, selector) {
		return page.$eval(selector, (elem) => {
			const rect = elem.getBoundingClientRect();
			return {
				x: rect.x - 30,
				y: rect.y - 10,
				width: rect.width + 150,
				height: rect.height + 70
			};
		});
	}

	after(async() => await browser.close());

	[
		'small-notification',
		'small-notification-truncated',
		'small-notification-truncated-rtl',
		'large-count',
		'large-count-large-number',
		'large-count-large-number-rtl',
		'hide-zero-nonzero-shown',
		'hide-zero-hidden',
		'skeleton'
	].forEach((testName) => {
		it(testName, async function() {
			const selector = `#${testName}`;
			const rect = await visualDiff.getRect(page, selector);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

	[
		'small-notification',
		'large-count',
	].forEach((testName) => {
		it(`${testName} focused`, async function() {
			const selector = `#${testName}`;
			await page.$eval(selector, (elem) => forceFocusVisible(elem));
			const rect = await visualDiff.getRect(page, selector);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

	describe('tooltip', () => {
		it('does not appear by default', async function() {
			const rect = await visualDiff.getRect(page, '#tooltip');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
		it('appears on focus-visible', async function() {
			await page.$eval('#tooltip', (elem) => forceFocusVisible(elem));
			await page.waitForTimeout(50);
			const rect = await getRect(page, '#tooltip');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});
});
