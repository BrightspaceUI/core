const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');
const { oneEvent } = require('@brightspace-ui/visual-diff/helpers');

describe('d2l-menu radio', () => {

	const visualDiff = new VisualDiff('menu-radio', __dirname);

	let browser, page;

	const click = (page, selector) => {
		const resize = oneEvent(page, selector, 'd2l-menu-item-change');
		page.$eval(selector, (item) => item.click());
		return resize;
	};

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);
		await page.goto(`${visualDiff.getBaseUrl()}/components/menu/test/menu-radio.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	after(async() => await browser.close());

	[
		'normal',
		'selected',
		'disabled',
		'supporting'
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

		it('changes selection when new selection clicked', async function() {
			click(page, '#normal-a');
			click(page, '#normal-b');
			const rect = await visualDiff.getRect(page, '#normal');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('does not deselect when clicked twice', async function() {
			click(page, '#normal-a');
			click(page, '#normal-a');
			const rect = await visualDiff.getRect(page, '#normal');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});
});
