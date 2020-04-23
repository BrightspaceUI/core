const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-more-less', () => {

	const visualDiff = new VisualDiff('more-less', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await browser.newPage();
		await visualDiff.disableAnimations(page);
		await page.setViewport({width: 800, height: 1100, deviceScaleFactor: 2});
		await page.goto(`${visualDiff.getBaseUrl()}/components/more-less/test/more-less.visual-diff.html`, {waitUntil: ['networkidle0', 'load']});
		await page.bringToFront();
	});

	after(async() => await browser.close());

	it('collapsed', async function() {
		const rect = await visualDiff.getRect(page, '#collapsed');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('expands on click', async function() {
		await click(page, '#collapsed');
		const rect = await visualDiff.getRect(page, '#collapsed');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('collapses on click', async function() {
		await click(page, '#expanded');
		const rect = await visualDiff.getRect(page, '#expanded');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('grows with content when expanded', async function() {
		const resize = contentResize(page, '#expanded');
		await page.evaluate(() => {
			const elem = document.querySelector('#expanded').querySelector('p');
			elem.textContent += 'Some content appended after component first render.';
		});
		await resize;
		const rect = await visualDiff.getRect(page, '#expanded');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('auto-expands on focus-in', async function() {
		const resize = contentResize(page, '#auto-expand');
		await page.evaluate(() => document.querySelector('#auto-expand').querySelector('a').focus());
		await resize;
		const rect = await visualDiff.getRect(page, '#auto-expand');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('auto-collapses on focus-out', async function() {
		const resize = contentResize(page, '#auto-expand');
		await visualDiff.resetFocus(page);
		await resize;
		const rect = await visualDiff.getRect(page, '#auto-expand');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('with custom height', async function() {
		const rect = await visualDiff.getRect(page, '#with-height');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('with custom blur', async function() {
		const rect = await visualDiff.getRect(page, '#with-custom-blur');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	const contentResize = (page, selector) => {
		return page.evaluate((selector) => {
			return new Promise((resolve) => {
				const elem = document.querySelector(selector);
				elem.shadowRoot.querySelector('.more-less-content').addEventListener('transitionend', (e) => {
					if (e.propertyName === 'height') resolve();
				});
			});
		}, selector);
	};

	const click = async(page, selector) => {
		const resize = contentResize(page, selector);
		await page.evaluate((selector) => {
			document.querySelector(selector).shadowRoot.querySelector('d2l-button-subtle').click();
		}, selector);
		return resize;
	};

});
