const puppeteer = require('puppeteer');
const visualDiff = require('visual-diff');

before(async() => {
	await visualDiff.initialize({
		name: 'button', dir: __dirname
	});
});

describe('d2l-button-subtle', function() {

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await browser.newPage();
		await page.setViewport({width: 800, height: 800, deviceScaleFactor: 2});
		await page.goto(`${visualDiff.baseUrl}/demo/button/button-subtle.html`, {waitUntil: ['networkidle2', 'load']});
		await page.bringToFront();
	});

	after(() => browser.close());

	it('normal', async function() {
		const rect = await visualDiff.puppeteer.getRect(page, '#normal');
		await visualDiff.puppeteer.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('mouse-hover', async function() {
		await page.hover('#normal');
		const rect = await visualDiff.puppeteer.getRect(page, '#normal');
		await visualDiff.puppeteer.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('focus', async function() {
		await page.evaluate(() => {
			const promise = new Promise((resolve) => {
				const elem = document.querySelector('#normal');
				elem.shadowRoot.querySelector('button').addEventListener('transitionend', resolve);
				elem.focus();
			});
			return promise;
		});
		const rect = await visualDiff.puppeteer.getRect(page, '#normal');
		await visualDiff.puppeteer.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('disabled', async function() {
		const rect = await visualDiff.puppeteer.getRect(page, '#disabled');
		await visualDiff.puppeteer.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('with-icon', async function() {
		const rect = await visualDiff.puppeteer.getRect(page, '#with-icon');
		await visualDiff.puppeteer.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('icon-right', async function() {
		const rect = await visualDiff.puppeteer.getRect(page, '#icon-right');
		await visualDiff.puppeteer.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

});
