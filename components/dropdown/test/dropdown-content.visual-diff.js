import { open } from './dropdown-helper.js';
import puppeteer from 'puppeteer';
import VisualDiff from '@brightspace-ui/visual-diff';

describe('d2l-dropdown-content', () => {

	const visualDiff = new VisualDiff('dropdown-content', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser, { viewport: { width: 800, height: 400 } });
		await page.goto(`${visualDiff.getBaseUrl()}/components/dropdown/test/dropdown-content.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	after(async() => await browser.close());

	[
		'default-width',
		'min-width',
		'max-width',
		'max-height',
		'max-height-invalid',
		'wide-opener',
		'with-header-footer',
		'no-padding-no-pointer',
		'scroll-bottom-shadow',
		'vertical-offset',
		'boundary-left-below',
		'boundary-right-above',
		'top-left',
		'top-middle',
		'top-right',
		'bottom-left',
		'bottom-middle',
		'bottom-right',
		'align-start',
		'align-end',
		'top-left-rtl',
		'top-middle-rtl',
		'top-right-rtl',
		'bottom-left-rtl',
		'bottom-middle-rtl',
		'bottom-right-rtl',
		'align-start-rtl',
		'align-end-rtl',
		'align-start-edge',
		'align-start-edge-rtl'
	].forEach((testName) => {

		it(testName, async function() {
			const selector = `#${testName}`;
			await open(page, selector);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
		});
	});

	[
		'mobile-right-tray',
		'mobile-left-tray',
		'mobile-no-tray',
		'mobile-right-tray-no-close',
		'mobile-left-tray-no-close',
		'mobile-right-tray-max-width',
		'mobile-left-tray-max-width'
	].forEach((testName) => {

		it(testName, async function() {
			await page.setViewport({ width: 600, height: 500 });
			const selector = `#${testName}`;
			await open(page, selector);
			await page.waitForTimeout(50);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
		});
	});

	it.skip('scroll-top-shadow', async function() {
		const selector = '#scroll-top-shadow';
		await open(page, selector);
		await page.$eval('#scroll-top-shadow d2l-dropdown-content', (content) => {
			content.scrollTo(1000);
		});
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
	});

});
