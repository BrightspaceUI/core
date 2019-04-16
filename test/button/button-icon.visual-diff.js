const puppeteer = require('puppeteer');
const VisualDiff = require('visual-diff');

describe('d2l-button-icon', function() {

	const visualDiff = new VisualDiff('button-icon', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await browser.newPage();
		await page.setViewport({width: 800, height: 800, deviceScaleFactor: 2});
		await page.goto(`${visualDiff.getBaseUrl()}/test/button/button-icon.visual-diff.html`, {waitUntil: ['networkidle2', 'load']});
		await page.bringToFront();
	});

	beforeEach(async() => {
		await visualDiff.resetFocus(page);
	});

	after(() => browser.close());

	describe('normal', function() {

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
			await page.evaluate(() => {
				const promise = new Promise((resolve) => {
					const elem = document.querySelector('#normal');
					elem.shadowRoot.querySelector('button').addEventListener('transitionend', resolve);
					elem.focus();
				});
				return promise;
			});
			const rect = await visualDiff.getRect(page, '#normal');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('disabled', async function() {
			const rect = await visualDiff.getRect(page, '#disabled');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

	});

	describe('translucent', function() {

		it('normal', async function() {
			const rect = await visualDiff.getRect(page, '#translucent-enabled');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('focus', async function() {
			await page.evaluate(() => {
				const promise = new Promise((resolve) => {
					const elem = document.querySelector('#translucent-enabled > d2l-button-icon');
					elem.shadowRoot.querySelector('button').addEventListener('transitionend', resolve);
					elem.focus();
				});
				return promise;
			});
			const rect = await visualDiff.getRect(page, '#translucent-enabled');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('hover', async function() {
			const p = page.evaluate(() => {
				const promise = new Promise((resolve) => {
					const elem = document.querySelector('#translucent-enabled > d2l-button-icon');
					elem.shadowRoot.querySelector('button').addEventListener('transitionend', resolve);
				});
				return promise;
			});
			await page.hover('#translucent-enabled > d2l-button-icon');
			await p;
			const rect = await visualDiff.getRect(page, '#translucent-enabled');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('disabled', async function() {
			const rect = await visualDiff.getRect(page, '#translucent-disabled');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

	});

});
