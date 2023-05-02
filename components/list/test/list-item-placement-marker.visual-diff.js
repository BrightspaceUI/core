import puppeteer from 'puppeteer';
import VisualDiff from '@brightspace-ui/visual-diff';

describe('d2l-list-item-placement-marker', () => {

	const visualDiff = new VisualDiff('list-item-placement-marker', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch({ headless: 'new' });
		page = await visualDiff.createPage(browser);
		await page.goto(`${visualDiff.getBaseUrl()}/components/list/test/list-item-placement-marker.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	after(async() => await browser.close());

	describe('placement-marker', () => {
		// rtl/ltr tests are combined with with broder/no-border to reduce test time and still cover both conditions
		it('ltr and no border', async function() {
			const rect = await visualDiff.getRect(page, '#placement-marker-ltr-no-border');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
		it('rtl and border', async function() {
			const rect = await visualDiff.getRect(page, '#placement-marker-rtl-with-border');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

	});
});
