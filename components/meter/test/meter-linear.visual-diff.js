import puppeteer from 'puppeteer';
import VisualDiff from '@brightspace-ui/visual-diff';

describe('d2l-meter-linear', () => {

	const visualDiff = new VisualDiff('meter-linear', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser, { viewport: { width: 800, height: 1000 } });
		await page.goto(`${visualDiff.getBaseUrl()}/components/meter/test/meter-linear.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	after(async() => await browser.close());

	[
		'normal-no-progress',
		'normal-progress',
		'normal-complete',
		'normal-percent',
		'normal-text',
		'normal-text-fraction',
		'normal-text-percent',
		'normal-foreground-light',
		'normal-text-fraction-rtl',
		'normal-text-percent-rtl',
		'normal-max-zero-value-zero',
		'normal-round-to-zero',
		'normal-over-100',
		'normal-max-zero-with-value',
		'text-inline-no-progress',
		'text-inline-progress',
		'text-inline-complete',
		'text-inline-percent',
		'text-inline-text-fraction',
		'text-inline-text-percent',
		'text-inline-foreground-light',
		'text-inline-text-fraction-rtl',
		'text-inline-text-percent-rtl'
	].forEach(name => {
		it(name, async function() {
			const rect = await visualDiff.getRect(page, `#${name}`);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

});
