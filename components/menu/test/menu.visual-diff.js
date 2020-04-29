const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-menu', () => {

	const visualDiff = new VisualDiff('menu', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser, {viewport: {width: 800, height: 1100}});
		await page.goto(`${visualDiff.getBaseUrl()}/components/menu/test/menu.visual-diff.html`, {waitUntil: ['networkidle0', 'load']});
		await page.bringToFront();
	});

	after(async() => await browser.close());

	it('separator', async function() {
		const rect = await visualDiff.getRect(page, '#separator');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('long menu item', async function() {
		const rect = await visualDiff.getRect(page, '#long');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('hidden menu item', async function() {
		const rect = await visualDiff.getRect(page, '#hidden');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('link menu item', async function() {
		const rect = await visualDiff.getRect(page, '#link');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	describe('normal', () => {

		afterEach(async() => {
			await page.reload();
		});

		it('simple', async function() {
			const rect = await visualDiff.getRect(page, '#normal');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('hover', async function() {
			await page.hover('#normal-b');
			const rect = await visualDiff.getRect(page, '#normal');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('focus', async function() {
			await page.focus('#normal-b');
			const rect = await visualDiff.getRect(page, '#normal');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('first item hover', async function() {
			await page.hover('#normal-first');
			const rect = await visualDiff.getRect(page, '#normal');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('first item focus', async function() {
			await page.focus('#normal-first');
			const rect = await visualDiff.getRect(page, '#normal');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('last item hover', async function() {
			await page.hover('#normal-last');
			const rect = await visualDiff.getRect(page, '#normal');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('last item focus', async function() {
			await page.focus('#normal-last');
			const rect = await visualDiff.getRect(page, '#normal');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

	describe('disabled', () => {
		afterEach(async() => {
			await page.reload();
		});

		it('simple', async function() {
			const rect = await visualDiff.getRect(page, '#disabled');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('hover', async function() {
			await page.hover('#disabled-item');
			const rect = await visualDiff.getRect(page, '#disabled');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('focus', async function() {
			await page.focus('#disabled-item');
			const rect = await visualDiff.getRect(page, '#disabled');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

	describe('nested', () => {

		it('simple', async function() {
			const rect = await visualDiff.getRect(page, '#nested');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('opens submenu on click', async function() {
			// this scenario also tests height change when going from 1 menu item to 2 within nested menu
			await page.$eval('#nested-item', item => item.click());
			const rect = await visualDiff.getRect(page, '#nested');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('leaves submenu when return clicked', async function() {
			await page.$eval('#nested-menu', item => {
				item.shadowRoot.querySelector('d2l-menu-item-return').click();
			});
			const rect = await visualDiff.getRect(page, '#nested');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('opens submenu on enter', async function() {
			await page.$eval('#nested-item', item => {
				return new Promise((resolve) => {
					const eventObj = document.createEvent('Events');
					eventObj.initEvent('keydown', true, true);
					eventObj.keyCode = 13;
					item.dispatchEvent(eventObj);
					requestAnimationFrame(resolve);
				});
			});
			const rect = await visualDiff.getRect(page, '#nested');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('leaves submenu on escape', async function() {
			await page.$eval('#nested-menu', (item) => {
				return new Promise((resolve) => {
					const eventObj = document.createEvent('Events');
					eventObj.initEvent('keyup', true, true);
					eventObj.keyCode = 27;
					item.querySelector('#b2').dispatchEvent(eventObj);
					requestAnimationFrame(resolve);
				});
			});
			const rect = await visualDiff.getRect(page, '#nested');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('long menu item', async function() {
			const rect = await visualDiff.getRect(page, '#nested-long');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('opens long menu item submenu on click', async function() {
			// this scenario also tests height change going from 3 menu items to 2 within nested menu
			await page.$eval('#nested-item-long', item => item.click());
			const rect = await visualDiff.getRect(page, '#nested-long');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('custom submenu', async function() {
			const rect = await visualDiff.getRect(page, '#custom-view');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('opens custom submenu on click', async function() {
			await page.$eval('#custom-view-item', item => {
				return new Promise((resolve) => {
					item.click();
					requestAnimationFrame(resolve);
				});
			});
			const rect = await visualDiff.getRect(page, '#custom-view');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

	});

});
