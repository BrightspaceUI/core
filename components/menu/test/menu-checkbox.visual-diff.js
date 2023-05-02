import { oneEvent, VisualDiff } from '@brightspace-ui/visual-diff';
import puppeteer from 'puppeteer';

describe('d2l-menu checkbox', () => {

	const visualDiff = new VisualDiff('menu-checkbox', import.meta.url);

	let browser, page;

	const click = (page, selector) => {
		const resize = oneEvent(page, selector, 'd2l-menu-item-change');
		page.$eval(selector, (item) => item.click());
		return resize;
	};

	before(async() => {
		browser = await puppeteer.launch({ headless: 'new' });
		page = await visualDiff.createPage(browser, { viewport: { width: 800, height: 900 } });
		await page.goto(`${visualDiff.getBaseUrl()}/components/menu/test/menu-checkbox.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	after(async() => await browser.close());

	[
		'normal',
		'selected',
		'disabled',
		'supporting',
		'long',
		'dark'
	].forEach((id) => {
		it(id, async function() {
			const rect = await visualDiff.getRect(page, `#${id}`);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
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
			click(page, '#normal-a');
			const rect = await visualDiff.getRect(page, '#normal');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('selects multiple when clicked', async function() {
			click(page, '#normal-a');
			click(page, '#normal-b');
			const rect = await visualDiff.getRect(page, '#normal');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('de-selects when clicked twice', async function() {
			click(page, '#normal-a');
			click(page, '#normal-a');
			const rect = await visualDiff.getRect(page, '#normal');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});
});
