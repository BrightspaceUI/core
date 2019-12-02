const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-menu radio', function() {

	const visualDiff = new VisualDiff('menu-radio', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await browser.newPage();
		await page.setViewport({width: 800, height: 800, deviceScaleFactor: 2});
		await page.goto(`${visualDiff.getBaseUrl()}/components/menu/test/menu-radio.visual-diff.html`, {waitUntil: ['networkidle0', 'load']});
		await page.bringToFront();
	});

	after(() => browser.close());

	it('normal', async function() {
		const rect = await visualDiff.getRect(page, '#normal');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('selected', async function() {
		const rect = await visualDiff.getRect(page, '#selected');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('selects when clicked', async function() {
		await click(page, '#a1');
		const rect = await visualDiff.getRect(page, '#normal');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('changes selection when new selection clicked', async function() {
		await click(page, '#a2');
		await click(page, '#b2');
		const rect = await visualDiff.getRect(page, '#normal-multiple-selected');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('does not deselect when clicked twice', async function() {
		await click(page, '#a3');
		await click(page, '#a3');
		const rect = await visualDiff.getRect(page, '#normal-multiple-clicks');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

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

});
