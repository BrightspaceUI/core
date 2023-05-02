import puppeteer from 'puppeteer';
import VisualDiff from '@brightspace-ui/visual-diff';

describe('d2l-meter-circle', () => {

	const visualDiff = new VisualDiff('meter-circle', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch({ headless: 'new' });
		page = await visualDiff.createPage(browser, { viewport: { width: 800, height: 2500 } });
		await page.goto(`${visualDiff.getBaseUrl()}/components/meter/test/meter-circle.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	after(async() => await browser.close());

	[
		'no-progress',
		'progress',
		'progress-rtl',
		'complete',
		'percent',
		'percent-rtl',
		'round-to-zero',
		'max-zero-with-value',
		'foreground-light',
		'scaled-larger',
		'scaled-smaller'
	].forEach(name => {
		it(name, async function() {
			const rect = await visualDiff.getRect(page, `#${name}`);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

});
