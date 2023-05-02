import { getRect, open, reset } from './dropdown-helper.js';
import puppeteer from 'puppeteer';
import VisualDiff from '@brightspace-ui/visual-diff';

describe('d2l-dropdown-openers', () => {

	const visualDiff = new VisualDiff('dropdown-openers', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch({ headless: 'new' });
		page = await visualDiff.createPage(browser, { viewport: { width: 300, height: 800 } });
		await page.goto(`${visualDiff.getBaseUrl()}/components/dropdown/test/dropdown-openers.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	after(async() => await browser.close());

	afterEach(async function() {
		const dropdown = this.currentTest.value;
		if (dropdown) await reset(page, dropdown);
	});

	// test for https://github.com/BrightspaceUI/core/issues/1398
	it('autoclose', async function() {
		await open(page, '#autoclose');
		await new Promise(resolve => setTimeout(resolve, 50));
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
			const selector = `#${testName}`; // Needed for retries
			this.test.value = selector;
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
			this.test.value = selector; // Needed for retries
			await open(page, selector);
			const rect = await getRect(page, selector);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

});
