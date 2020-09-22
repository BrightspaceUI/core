const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-menu checkbox', () => {

	const visualDiff = new VisualDiff('menu-checkbox', __dirname);

	let browser, page;

	const contentResize = (page, selector) => {
		return page.$eval(selector, (item) => {
			return new Promise((resolve) => {
				item.addEventListener('d2l-menu-item-change', () => {
					resolve();
				});
			});
		});
	};

	const click = async(page, selector) => {
		const resize = contentResize(page, selector);
		await page.$eval(selector, (item) => item.click());
		return resize;
	};

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);
		await page.goto(`${visualDiff.getBaseUrl()}/components/menu/test/menu-checkbox.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	after(async() => await browser.close());

	it('normal', async function() {
		const rect = await visualDiff.getRect(page, '#normal');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('selected', async function() {
		const rect = await visualDiff.getRect(page, '#selected');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('disabled', async function() {
		const rect = await visualDiff.getRect(page, '#disabled');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('does not select disabled item', async function() {
		const selector = '#disabled-b';
		await page.$eval(selector, (item) => {
			return new Promise((resolve) => {
				item.addEventListener('click', () => {
					resolve();
				});
				item.click();
			});
		});
		const rect = await visualDiff.getRect(page, '#disabled');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	describe('selection behavior', () => {
		afterEach(async() => {
			await page.reload();
		});

		it('selects when clicked', async function() {
			await click(page, '#normal-a');
			const rect = await visualDiff.getRect(page, '#normal');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('selects multiple when clicked', async function() {
			await click(page, '#normal-a');
			await click(page, '#normal-b');
			const rect = await visualDiff.getRect(page, '#normal');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('de-selects when clicked twice', async function() {
			await click(page, '#normal-a');
			await click(page, '#normal-a');
			const rect = await visualDiff.getRect(page, '#normal');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});
});
