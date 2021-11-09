/*global forceFocusVisible */
import puppeteer from 'puppeteer';
import VisualDiff from '@brightspace-ui/visual-diff';

describe('d2l-count-badge-icon', () => {

	const visualDiff = new VisualDiff('count-badge-icon', __dirname);

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
				x: rect.x + 15,
				y: rect.y + 20,
				width: rect.width - 30,
				height: rect.height - 50
			};
		});
	}

	async function getRectWithTooltip(page, selector) {
		return page.$eval(selector, (elem) => {
			const rect = elem.getBoundingClientRect();
			return {
				x: rect.x - 30,
				y: rect.y - 50,
				width: rect.width + 60,
				height: rect.height + 50
			};
		});
	}

	after(async() => await browser.close());

	[
		'large-count-icon',
		'large-count-icon-rtl',
		'icon-skeleton'
	].forEach((testName) => {
		it(testName, async function() {
			const selector = `#${testName}`;
			const rect = await getRect(page, selector);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

	[
		'small-notification-icon',
		'small-notification-icon-rtl'
	].forEach((testName) => {
		it(`${testName} focused`, async function() {
			const selector = `#${testName}`;
			await page.$eval(selector, (elem) => forceFocusVisible(elem));
			const rect = await getRect(page, selector);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

	describe('icon and tooltip', () => {
		it('tooltip does not appear by default', async function() {
			const rect = await getRect(page, '#tooltip-icon');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
		it('tooltip appears on focus-visible', async function() {
			await page.$eval('#tooltip-icon', (elem) => forceFocusVisible(elem));
			await page.waitForTimeout(50);
			const rect = await getRectWithTooltip(page, '#tooltip-icon');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});
});
