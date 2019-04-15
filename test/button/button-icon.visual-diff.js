const puppeteer = require('puppeteer');
const VisualDiff = require('visual-diff');

describe('d2l-button-icon', function() {

	const visualDiff = new VisualDiff('button', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await browser.newPage();
		await page.setViewport({width: 800, height: 800, deviceScaleFactor: 2});
		await page.goto(`${visualDiff.getBaseUrl()}/test/button/button-icon.visual-diff.html`, {waitUntil: ['networkidle2', 'load']});
		await page.bringToFront();
	});

	after(() => browser.close());

	it('normal', async function() {
		const rect = await visualDiff.getRect(page, '#normal');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('mouse-hover', async function() {
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

	describe('visible-on-ancestor', function() {

		it('normal', async function() {
			const rect = await visualDiff.getRect(page, '.ancestor-container');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('mouse-hover', async function() {
			await page.hover('.ancestor-container');
			const rect = await visualDiff.getRect(page, '.ancestor-container');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('focus', async function() {
			await page.evaluate(() => {
				const promise = new Promise((resolve) => {
					const elem = document.querySelector('#voaDisabled');
					elem.shadowRoot.querySelector('button').addEventListener('transitionend', resolve);
					elem.focus();
				});
				return promise;
			});
			const rect = await visualDiff.getRect(page, '.ancestor-container');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

	});

	describe('translucent', function() {

		it('normal', async function() {
			const rect = await visualDiff.getRect(page, '.translucent-container');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('mouse-hover', async function() {
			const p = page.evaluate(() => {
				const promise = new Promise((resolve) => {
					const elem = document.querySelector('#translucent');
					elem.shadowRoot.querySelector('button').addEventListener('transitionend', resolve);
				});
				return promise;
			});
			await page.hover('#translucent');
			await p;
			const rect = await visualDiff.getRect(page, '.translucent-container');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('focus', async function() {
			await page.evaluate(() => {
				const promise = new Promise((resolve) => {
					const elem = document.querySelector('#translucent-focus > d2l-button-icon');
					elem.shadowRoot.querySelector('button').addEventListener('transitionend', resolve);
					elem.focus();
				});
				return promise;
			});
			const rect = await visualDiff.getRect(page, '#translucent-focus');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

	});

});
