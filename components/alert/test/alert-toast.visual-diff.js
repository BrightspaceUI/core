import { getRect, open } from './alert-toast-helper.js';
import puppeteer from 'puppeteer';
import VisualDiff from '@brightspace-ui/visual-diff';

describe('d2l-alert-toast', () => {

	const visualDiff = new VisualDiff('alert-toast', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch({ headless: 'new' });
		page = await visualDiff.createPage(browser, { viewport: { width: 700, height: 400 } });
		await page.goto(`${visualDiff.getBaseUrl()}/components/alert/test/alert-toast.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	after(async() => await browser.close());

	afterEach(async() => {
		await page.reload();
	});

	[
		'default',
		'no-close',
		'button-close',
		'subtext-button-close'
	].forEach((testName) => {
		it(testName, async function() {
			const selector = `#${testName}`;
			await open(page, selector);
			const rect = await getRect(page, selector);

			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

	describe('responsive-position', () => {
		it('wide', async function() {
			await open(page, '#subtext-button-close');

			await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
		});

		it('narrow', async function() {
			page = await visualDiff.createPage(browser, { viewport: { width: 400, height: 400 } });
			await page.goto(`${visualDiff.getBaseUrl()}/components/alert/test/alert-toast.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
			await page.bringToFront();
			await open(page, '#subtext-button-close');

			await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
		});
	});

});
