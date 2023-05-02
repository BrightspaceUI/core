import puppeteer from 'puppeteer';
import { show } from './tooltip-helper.js';
import VisualDiff from '@brightspace-ui/visual-diff';

describe('d2l-tooltip', () => {

	const visualDiff = new VisualDiff('tooltip', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch({ headless: 'new' });
		page = await visualDiff.createPage(browser, { viewport: { width: 400, height: 400 } });
		await page.goto(`${visualDiff.getBaseUrl()}/components/tooltip/test/tooltip.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	afterEach(async() => {
		await page.reload();
	});

	after(async() => await browser.close());

	[
		'position-top',
		'position-bottom',
		'position-right',
		'position-left',
		'position-right-rtl',
		'position-left-rtl',
		'top-left',
		'top-middle',
		'top-right',
		'bottom-left',
		'bottom-middle',
		'bottom-right',
		'middle-left',
		'middle-right',
		'boundary-top-right',
		'boundary-bottom-left',
		'min-width',
		'max-width',
		'horizontal',
		'horizontal-rtl',
		'wide-target-horizontal',
		'wide-target-vertical',
		'too-big-for-space',
		'align-start',
		'align-start-narrow',
		'align-start-rtl',
		'align-end',
		'align-end-narrow',
		'align-end-rtl',
		'bounded'
	].forEach((testName) => {

		it(testName, async function() {
			const selector = `#${testName}`;
			await show(page, selector);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
		});

	});

	describe('dark-background', () => {
		beforeEach(async() => await page.addStyleTag({ content: 'body { background-color: black }' }));

		[
			'position-top',
			'position-bottom',
			'position-right',
			'position-left'
		].forEach((testName) => {

			it(testName, async function() {
				const selector = `#${testName}`;
				await show(page, selector);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
			});

		});
	});

});
