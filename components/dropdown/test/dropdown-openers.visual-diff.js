import { getRect, open } from './dropdown-helper.js';
import puppeteer from 'puppeteer';
import VisualDiff from '@brightspace-ui/visual-diff';

describe('d2l-dropdown-openers', () => {

	const visualDiff = new VisualDiff('dropdown-openers', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser, { viewport: { width: 300, height: 800 } });
		await page.goto(`${visualDiff.getBaseUrl()}/components/dropdown/test/dropdown-openers.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	after(async() => await browser.close());

	// test for https://github.com/BrightspaceUI/core/issues/1398
	it('autoclose', async function() {
		await open(page, '#autoclose');
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');
		const rect = await visualDiff.getRect(page, '#autoclose');
		rect.height += 50;
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	[
		'button-primary',
		'button-full-width',
		'button-rtl',
	].forEach((testName) => {
		it(testName, async function() {
			const selector = `#${testName}`;
			const rect = await visualDiff.getRect(page, selector);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

	[
		'button',
		'button-subtle',
		'context-menu',
		'more'
	].forEach((testName) => {
		it(testName, async function() {
			const selector = `#${testName}`;
			await open(page, selector);
			const rect = await getRect(page, selector);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

});
