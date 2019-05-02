const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-button-subtle', function() {

	const visualDiff = new VisualDiff('button-subtle', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await browser.newPage();
		await page.setViewport({width: 800, height: 800, deviceScaleFactor: 2});
		await page.goto(`${visualDiff.getBaseUrl()}/test/button/button-subtle.visual-diff.html`, {waitUntil: ['networkidle0', 'load']});
		await page.bringToFront();
	});

	after(() => browser.close());

	it('normal', async function() {
		const rect = await visualDiff.getRect(page, '#normal');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('hover', async function() {
		await page.hover('#normal');
		const rect = await visualDiff.getRect(page, '#normal');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('focus', async function() {
		await focus(page, '#normal');
		const rect = await visualDiff.getRect(page, '#normal');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('disabled', async function() {
		const rect = await visualDiff.getRect(page, '#disabled');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('with-icon', async function() {
		const rect = await visualDiff.getRect(page, '#with-icon');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('with-icon-rtl', async function() {
		const rect = await visualDiff.getRect(page, '#with-icon-rtl');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('icon-right', async function() {
		const rect = await visualDiff.getRect(page, '#icon-right');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('icon-right-rtl', async function() {
		const rect = await visualDiff.getRect(page, '#icon-right-rtl');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	const focus = async(page, selector) => {
		return page.evaluate((selector) => {
			return new Promise((resolve) => {
				const elem = document.querySelector(selector);
				elem.shadowRoot.querySelector('button').addEventListener('transitionend', resolve);
				elem.focus();
			});
		}, selector);
	};

});
