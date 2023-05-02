import puppeteer from 'puppeteer';
import VisualDiff from '@brightspace-ui/visual-diff';

describe('d2l-menu rtl', () => {

	const visualDiff = new VisualDiff('menu-rtl', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch({ headless: 'new' });
		page = await visualDiff.createPage(browser, { viewport: { width: 800, height: 1000 } });
		await page.goto(`${visualDiff.getBaseUrl()}/components/menu/test/menu-rtl.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	after(async() => await browser.close());

	[
		'normal',
		'checkbox',
		'radio',
		'supporting'
	].forEach((id) => {
		it(id, async function() {
			const rect = await visualDiff.getRect(page, `#${id}`);
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
			await page.$eval('#nested-item', item => {
				return new Promise((resolve) => {
					item.addEventListener('d2l-hierarchical-view-show-complete', () => requestAnimationFrame(resolve), { once: true });
					item.click();
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
			await page.$eval('#nested-item-long', item => {
				return new Promise((resolve) => {
					item.addEventListener('d2l-hierarchical-view-show-complete', () => requestAnimationFrame(resolve), { once: true });
					item.click();
				});
			});
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
					item.addEventListener('d2l-hierarchical-view-show-complete', () => requestAnimationFrame(resolve), { once: true });
					item.click();
				});
			});
			const rect = await visualDiff.getRect(page, '#custom-view');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

});
