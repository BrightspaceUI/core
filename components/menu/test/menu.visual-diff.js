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
		const selector = '#b1';
		const resize = contentResize(page, selector);
		await page.evaluate((selector) => {
			document.querySelector(selector).click();
		}, selector);
		await resize;
		const rect = await visualDiff.getRect(page, '#nested');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('leaves nested menu when return clicked', async function() {
		const resize = contentResizeReturn(page);
		await page.evaluate(() => {
			document.querySelector('#nestedMenu').shadowRoot.querySelector('d2l-menu-item-return').click();
		});
		await resize;
		const rect = await visualDiff.getRect(page, '#nested');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('opens nested menu on enter', async function() {
		const selector = '#b1';
		const resize = contentResize(page, selector);
		await page.evaluate((selector) => {
			const eventObj = document.createEvent('Events');
			eventObj.initEvent('keydown', true, true);
			eventObj.keyCode = 13;
			document.querySelector(selector).dispatchEvent(eventObj);
		}, selector);
		await resize;
		const rect = await visualDiff.getRect(page, '#nested');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('leaves nested menu on escape', async function() {
		const resize = contentResizeReturn(page);
		await page.evaluate(() => {
			const eventObj = document.createEvent('Events');
			eventObj.initEvent('keyup', true, true);
			eventObj.keyCode = 27;
			document.querySelector('#b2').dispatchEvent(eventObj);
		});
		await resize;
		const rect = await visualDiff.getRect(page, '#nested');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	const contentResizeReturn = (page) => {
		return page.evaluate(() => {
			return new Promise((resolve) => {
				const elem = document.querySelector('#nestedMenu');
				elem.addEventListener('d2l-hierarchical-view-hide-complete', () => {
					resolve();
				});
			});
		});
	};

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
});
