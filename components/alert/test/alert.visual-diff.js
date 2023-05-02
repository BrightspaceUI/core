import puppeteer from 'puppeteer';
import VisualDiff from '@brightspace-ui/visual-diff';

describe('d2l-alert', () => {

	const visualDiff = new VisualDiff('alert', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch({ headless: 'new' });
		page = await visualDiff.createPage(browser, { viewport: { width: 800, height: 1500 } });
		await page.goto(`${visualDiff.getBaseUrl()}/components/alert/test/alert.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	after(async() => await browser.close());

	[
		'type-default',
		'type-success',
		'type-critical',
		'type-warning',
		'type-error',
		'type-call-to-action',
		'close',
		'button',
		'button-close',
		'rtl',
		'hidden',
		'no-padding',
		'no-padding-rtl'
	].forEach((testName) => {
		it(testName, async function() {
			const selector = `#${testName}`;
			const rect = await visualDiff.getRect(page, selector);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

	it('narrow', async function() {
		page = await visualDiff.createPage(browser, { viewport: { width: 600, height: 1200 } });
		await page.goto(`${visualDiff.getBaseUrl()}/components/alert/test/alert.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
		const rect = await visualDiff.getRect(page, '#button-close');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

});
