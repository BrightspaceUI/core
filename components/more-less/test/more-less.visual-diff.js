const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-more-less', function() {

	const visualDiff = new VisualDiff('more-less', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await browser.newPage();
		await page.setViewport({width: 800, height: 800, deviceScaleFactor: 2});
		await page.goto(`${visualDiff.getBaseUrl()}/components/more-less/test/more-less.visual-diff.html`, {waitUntil: ['networkidle0', 'load']});
		await page.bringToFront();
	});

	beforeEach(async() => {
		await visualDiff.resetFocus(page);
	});

	after(() => browser.close());

	it('collapsed', async function() {
		const rect = await visualDiff.getRect(page, '#collapsed');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('expanded by click', async function() {
		await click(page, '#collapsed');
		const rect = await visualDiff.getRect(page, '#collapsed');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('collapsed by click', async function() {
		await click(page, '#expanded');
		const rect = await visualDiff.getRect(page, '#expanded');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('with-height', async function() {
		const rect = await visualDiff.getRect(page, '#with-height');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('with-custom-blur', async function() {
		const rect = await visualDiff.getRect(page, '#with-custom-blur');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	const click = (page, selector) => {
		return page.evaluate((selector) => {
			return new Promise((resolve) => {
				const elem = document.querySelector(selector);
				elem.shadowRoot.querySelector('.more-less-content').addEventListener('transitionend', (e) => {
					if (e.propertyName === 'height') resolve();
				});
				elem.shadowRoot.querySelector('d2l-button-subtle').click();
			});
		}, selector);
	};

});
