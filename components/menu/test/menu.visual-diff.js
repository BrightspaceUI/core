const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-menu', function() {

	const visualDiff = new VisualDiff('menu', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await browser.newPage();
		await page.setViewport({width: 800, height: 800, deviceScaleFactor: 2});
		await page.goto(`${visualDiff.getBaseUrl()}/components/menu/test/menu.visual-diff.html`, {waitUntil: ['networkidle0', 'load']});
		await page.bringToFront();
	});

	after(() => browser.close());

	it('normal', async function() {
		const rect = await visualDiff.getRect(page, '#normal');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('hidden menu item', async function() {
		const rect = await visualDiff.getRect(page, '#hidden');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('disabled menu item', async function() {
		const rect = await visualDiff.getRect(page, '#disabled');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('nested menu', async function() {
		const rect = await visualDiff.getRect(page, '#nested');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('opens nested menu on click', async function() {
		await click(page, '#b1');
		const rect = await visualDiff.getRect(page, '#nested');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	// it('opens nested menu on enter', async function() {
	// 	const rect = await visualDiff.getRect(page, '#collapsed');
	// 	await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	// });
	//
	// it('leaves nested menu on escape', async function() {
	// 	const rect = await visualDiff.getRect(page, '#collapsed');
	// 	await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	// });
	//
	// it('leaves nested menu when return clicked', async function() {
	// 	const rect = await visualDiff.getRect(page, '#collapsed');
	// 	await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	// });

	const contentResize = (page, selector) => {
		return page.evaluate((selector) => {
			return new Promise((resolve) => {
				const elem = document.querySelector(selector);
				elem.addEventListener('d2l-hierarchical-view-show-complete', () => {
					resolve();
				});
			});
		}, selector);
	};

	const click = async(page, selector) => {
		const resize = contentResize(page, selector);
		await page.evaluate((selector) => {
			document.querySelector(selector).click();
		}, selector);
		return resize;
	};

});
