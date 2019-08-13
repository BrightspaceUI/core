const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-list', function() {

	const visualDiff = new VisualDiff('list', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await browser.newPage();
		await page.setViewport({width: 900, height: 900, deviceScaleFactor: 2});
		await page.goto(`${visualDiff.getBaseUrl()}/components/list/test/list.visual-diff.html`, {waitUntil: ['networkidle0', 'load']});
		await page.bringToFront();
	});

	after(() => browser.close());

	describe('List tests for dividers', () => {
		[
			{ title: 'list-divider-none', fixture: '#list-divider-none' },
			{ title: 'list-divider-extended', fixture: '#list-divider-extended' },
			{ title: 'list-divider-all', fixture: '#list-divider-all' },
			{ title: 'list-divider-middle', fixture: '#list-divider-middle' },
			{ title: 'list-divider-top', fixture: '#list-divider-top' },
			{ title: 'list-divider-bottom', fixture: '#list-divider-bottom' }
		].forEach((testData) => {
			it(testData.title, async function() {
				const rect = await visualDiff.getRect(page, testData.fixture);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});
		});
	});

	describe('List tests for breakpoint', () => {
		[842, 636, 580, 0].forEach(breakPoint => {
			it(`list-bp${breakPoint}`, async function() {
				const rect = await visualDiff.getRect(page, `#list-bp${breakPoint}`);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});
		});
	});

	it('list-rtl', async function() {
		const rect = await visualDiff.getRect(page, '#list-rtl');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

});
