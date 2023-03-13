import { focusWithKeyboard, VisualDiff } from '@brightspace-ui/visual-diff';
import puppeteer from 'puppeteer';

function itWithReload(name, test, getPage) {
	return it(name, async function() {
		try { await test.call(this); }
		finally { await getPage().reload(); }
	});
}

describe('d2l-list-item-drag-handle', () => {

	const visualDiff = new VisualDiff('list-item-drag-handle', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);
		await page.goto(`${visualDiff.getBaseUrl()}/components/list/test/list-item-drag-handle.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	after(async() => await browser.close());

	beforeEach(async() => await visualDiff.resetFocus(page));

	describe('dragger', () => {
		it('simple', async function() {
			const rect = await visualDiff.getRect(page, '#drag-handle');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('focus', async function() {
			await focusWithKeyboard(page, 'd2l-list-item-drag-handle');
			const rect = await visualDiff.getRect(page, '#drag-handle');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		itWithReload('keyboard-mode', async function() {
			await page.$eval('d2l-list-item-drag-handle', (item) => { item._keyboardActive = true; });
			const rect = await visualDiff.getRect(page, '#drag-handle');
			rect.width = 320;
			rect.height = 200;
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		}, () => page);

	});

});
