const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-menu rtl', () => {

	const visualDiff = new VisualDiff('menu-rtl', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await browser.newPage();
		await page.setViewport({width: 800, height: 900, deviceScaleFactor: 2});
		await page.goto(`${visualDiff.getBaseUrl()}/components/menu/test/menu-rtl.visual-diff.html`, {waitUntil: ['networkidle0', 'load']});
		await page.bringToFront();
	});

	after(() => browser.close());

	it('normal', async function() {
		const rect = await visualDiff.getRect(page, '#normal');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('checkbox', async function() {
		const rect = await visualDiff.getRect(page, '#checkbox');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('radio', async function() {
		const rect = await visualDiff.getRect(page, '#radio');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	describe('nested', () => {
		it('simple', async function() {
			const rect = await visualDiff.getRect(page, '#nested');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('opens submenu on click', async function() {
			// this scenario also tests height change when going from 1 menu item to 2 within nested menu
			const selector = '#nested-item';
			const resize = contentResize(page, selector);
			await page.$eval(selector, (item) => item.click());
			await resize;
			const rect = await visualDiff.getRect(page, '#nested');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('long menu item', async function() {
			const rect = await visualDiff.getRect(page, '#nested-long');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('opens long menu item submenu on click', async function() {
			// this scenario also tests height change going from 3 menu items to 2 within nested menu
			const selector = '#nested-item-long';
			const resize = contentResize(page, selector);
			await page.$eval(selector, (item) => item.click());
			await resize;
			const rect = await visualDiff.getRect(page, '#nested-long');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('custom submenu', async function() {
			const rect = await visualDiff.getRect(page, '#custom-view');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('opens custom submenu on click', async function() {
			const selector = '#custom-view-item';
			const resize = contentResize(page, selector);
			await page.$eval(selector, (item) => item.click());
			await resize;
			const rect = await visualDiff.getRect(page, '#custom-view');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

	const contentResize = (page, selector) => {
		return page.$eval(selector, (item) => {
			return new Promise((resolve) => {
				item.addEventListener('d2l-hierarchical-view-show-complete', () => {
					resolve();
				});
			});
		});
	};
});
