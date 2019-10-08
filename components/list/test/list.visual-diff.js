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

	describe('separators', () => {
		[
			{ title: 'none', fixture: '#list-separators-none' },
			{ title: 'extend', fixture: '#list-separators-extend' },
			{ title: 'all', fixture: '#list-separators-all' },
			{ title: 'between', fixture: '#list-separators-between' }
		].forEach((testData) => {
			it(testData.title, async function() {
				const rect = await visualDiff.getRect(page, testData.fixture);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});
		});
	});

	describe('breakpoints', () => {
		[842, 636, 580, 0].forEach(breakPoint => {
			it(`${breakPoint}`, async function() {
				const rect = await visualDiff.getRect(page, `#list-bp${breakPoint}`);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});
		});
	});

	it('rtl', async function() {
		const rect = await visualDiff.getRect(page, '#list-rtl');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

});
