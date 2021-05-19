import { getRect, open } from './dropdown-helper.js';
import puppeteer from 'puppeteer';
import VisualDiff from '@brightspace-ui/visual-diff';

describe('d2l-dropdown-openers', () => {

	const visualDiff = new VisualDiff('dropdown-openers', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser, { viewport: { width: 300, height: 800 } });
		await page.goto(`${visualDiff.getBaseUrl()}/components/dropdown/test/dropdown-openers.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	after(async() => await browser.close());

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
