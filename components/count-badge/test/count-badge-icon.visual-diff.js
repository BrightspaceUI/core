import { focusWithKeyboard, VisualDiff } from '@brightspace-ui/visual-diff';
import puppeteer from 'puppeteer';

describe('d2l-count-badge-icon', () => {

	const visualDiff = new VisualDiff('count-badge-icon', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);
		await page.goto(`${visualDiff.getBaseUrl()}/components/count-badge/test/count-badge-icon.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
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
		'large-count-icon',
		'large-count-icon-rtl',
		'icon-skeleton',
		'large-number-centered',
		'large-number-centered-rtl'
	].forEach((testName) => {
		it(testName, async function() {
			const selector = `#${testName}`;
			const rect = await visualDiff.getRect(page, selector);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

	[
		'small-notification-icon',
		'small-notification-icon-rtl'
	].forEach((testName) => {
		it(`${testName} focused`, async function() {
			const selector = `#${testName}`;
			await focusWithKeyboard(page, selector);
			const rect = await visualDiff.getRect(page, selector);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

	describe('icon and tooltip', () => {
		it('tooltip does not appear by default', async function() {
			const rect = await visualDiff.getRect(page, '#tooltip-icon');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
		it('tooltip appears on focus-visible', async function() {
			await focusWithKeyboard(page, '#tooltip-icon');
			await page.waitForTimeout(50);
			const rect = await getRect(page, '#tooltip-icon');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});
});
