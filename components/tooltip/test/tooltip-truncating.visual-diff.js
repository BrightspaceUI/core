import { getRect } from './tooltip-helper.js';
import puppeteer from 'puppeteer';
import VisualDiff from '@brightspace-ui/visual-diff';

describe.skip('d2l-tooltip truncating', () => {

	const visualDiff = new VisualDiff('tooltip-truncating', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser, { viewport: { width: 400, height: 600 } });
		await page.goto(`${visualDiff.getBaseUrl()}/components/tooltip/test/tooltip-truncating.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	afterEach(async() => {
		await page.reload();
	});

	after(async() => await browser.close());

	[
		{ name: 'button-not-truncating', focus: ' :first-child' },
		{ name: 'button-truncating', focus: ' :first-child' },
		{ name: 'link-not-truncating', focus: ' :first-child' },
		{ name: 'link-truncating', focus: ' :first-child' }
	].forEach((testCase) => {

		it(testCase.name, async function() {
			const selector = `#${testCase.name}`;
			await page.$eval(`${selector}${testCase.focus}`, (content) => {
				content.focus();
			});
			const rect = await getRect(page, selector);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { captureBeyondViewport: false, clip: rect });
		});

	});

});
