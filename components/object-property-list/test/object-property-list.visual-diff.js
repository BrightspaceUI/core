import { focusWithKeyboard, VisualDiff } from '@brightspace-ui/visual-diff';
import puppeteer from 'puppeteer';

describe('d2l-object-property-list', () => {

	const visualDiff = new VisualDiff('object-property-list', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch({ headless: 'new' });
		page = await visualDiff.createPage(browser);
		await page.goto(`${visualDiff.getBaseUrl()}/components/object-property-list/test/object-property-list.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	after(async() => await browser.close());

	[
		{ name: 'single', selector: '#single' },
		{ name: 'all-types', selector: '#all-types' },
		{ name: 'word-wrap', selector: '#word-wrap' },
		{ name: 'focus', selector: '#all-types', action: selector => { return focusWithKeyboard(page, `${selector} d2l-object-property-list-item-link`); } },
		{ name: 'rtl', selector: '#rtl' },
		{ name: 'list-skeleton', selector: '#list-skeleton' },
		{ name: 'item-skeleton', selector: '#item-skeleton' },
		{ name: 'hidden-items', selector: '#hidden-items' },
	].forEach((info) => {
		it(info.name, async function() {
			const rect = await visualDiff.getRect(page, info.selector);
			if (info.action) await info.action(info.selector);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

});
