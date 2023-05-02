import puppeteer from 'puppeteer';
import VisualDiff from '@brightspace-ui/visual-diff';

describe('d2l-icon-custom', () => {

	const visualDiff = new VisualDiff('icon-custom', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch({ headless: 'new' });
		page = await visualDiff.createPage(browser);
		await page.goto(`${visualDiff.getBaseUrl()}/components/icons/test/icon-custom.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	after(async() => await browser.close());

	[
		'tier1',
		'tier2',
		'tier3',
		'fill-none',
		'fill-circle',
		'fill-mixed',
		'color-override',
		'size-override',
		'rtl-tier1',
		'rtl-tier2',
		'rtl-tier3'
	].forEach((name) => {
		it(name, async function() {
			const rect = await visualDiff.getRect(page, `#${name}`);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

});
