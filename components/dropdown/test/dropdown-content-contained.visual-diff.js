import { open, reset } from './dropdown-helper.js';
import puppeteer from 'puppeteer';
import VisualDiff from '@brightspace-ui/visual-diff';

describe('d2l-dropdown-content-contained', () => {

	const visualDiff = new VisualDiff('dropdown-content-contained', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch({ headless: 'new' });
		page = await visualDiff.createPage(browser);
		await page.goto(`${visualDiff.getBaseUrl()}/components/dropdown/test/dropdown-content-contained.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	after(async() => await browser.close());

	afterEach(async function() {
		const dropdown = this.currentTest.value;
		if (dropdown) await reset(page, dropdown);
	});

	[
		'contained-top',
		'contained-bottom'
	].forEach((testName) => {
		it(testName, async function() {
			const rect = await visualDiff.getRect(page, `#${testName}`);
			const selector = `#${testName} d2l-dropdown`;
			this.test.value = selector; // Needed for retries
			await open(page, selector);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

});
