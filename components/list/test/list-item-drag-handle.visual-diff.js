const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe.skip('d2l-list-item-drag-handle', () => {

	const visualDiff = new VisualDiff('list-item-drag-handle', __dirname);

	let browser, page;

	const focusMethod = (selector) => {
		return page.$eval(selector, (item) => { item.focus(); });
	};

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
			await focusMethod('d2l-list-item-drag-handle');
			const rect = await visualDiff.getRect(page, '#drag-handle');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('keyboard-mode', async function() {
			await focusMethod('d2l-list-item-drag-handle');
			await page.$eval('d2l-list-item-drag-handle', (item) => { item._keyboardActive = true; });
			const rect = await visualDiff.getRect(page, '#drag-handle');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

	});

});
