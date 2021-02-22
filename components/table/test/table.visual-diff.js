const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-table', () => {

	const visualDiff = new VisualDiff('table', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);
		await page.goto(`${visualDiff.getBaseUrl()}/components/table/test/table.visual-diff.html?dir=ltr`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	beforeEach(async() => await visualDiff.resetFocus(page));

	after(async() => await browser.close());

	it('test1', async function() {
		const rect = await visualDiff.getRect(page, '#test1');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

});
