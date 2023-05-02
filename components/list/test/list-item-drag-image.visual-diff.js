import puppeteer from 'puppeteer';
import VisualDiff from '@brightspace-ui/visual-diff';

describe('d2l-list-item-drag-image', () => {

	const visualDiff = new VisualDiff('list-item-drag-image', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch({ headless: 'new' });
		page = await visualDiff.createPage(browser);
		await page.goto(`${visualDiff.getBaseUrl()}/components/list/test/list-item-drag-image.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	after(async() => await browser.close());

	[
		{ name: '1-digit', selector: '#one-digit' },
		{ name: '2-digit', selector: '#two-digit' },
		{ name: '4-digit', selector: '#four-digit' },
		{ name: 'rtl', selector: '#rtl' },
	].forEach(info => {
		it(info.name, async function() {
			//if (info.action) await info.action(info.selector);
			const rect = await visualDiff.getRect(page, info.selector);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

});
