const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-list-item-placement-marker', () => {

	const visualDiff = new VisualDiff('list-item-placement-marker', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);
		await page.goto(`${visualDiff.getBaseUrl()}/components/list/test/list-item-placement-marker.visual-diff.html`, {waitUntil: ['networkidle0', 'load']});
		await page.bringToFront();
	});

	after(async() => await browser.close());

	beforeEach(async() => await visualDiff.resetFocus(page));

	describe('placement-marker', () => {
		it('ltr', async function() {
			const rect = await visualDiff.getRect(page, '#placement-marker');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
		it('rtl', async function() {
			const rect = await visualDiff.getRect(page, '#placement-marker-rtl');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
		it('ltr-with-border', async function() {
			const rect = await visualDiff.getRect(page, '#placement-marker-with-border');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
		it('rtl-with-border', async function() {
			const rect = await visualDiff.getRect(page, '#placement-marker-rtl-with-border');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});
});
