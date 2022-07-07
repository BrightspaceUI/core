import puppeteer from 'puppeteer';
import VisualDiff from '@brightspace-ui/visual-diff';

describe('d2l-object-property-list', () => {

	const visualDiff = new VisualDiff('object-property-list', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);
		await page.goto(`${visualDiff.getBaseUrl()}/components/object-property-list/test/object-property-list.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	after(async() => await browser.close());

	[
		{ name: 'single', selector: '#single' },
		{ name: 'all-types', selector: '#all-types' },
		{ name: 'word-wrap', selector: '#word-wrap' },
	].forEach((info) => {
		it(info.name, async function() {
			const rect = await visualDiff.getRect(page, info.selector);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

});
