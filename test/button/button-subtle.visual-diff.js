const puppeteer = require('puppeteer');
const VisualDiff = require('visual-diff');

describe('d2l-button-subtle', function() {

	const visualDiff = new VisualDiff('button', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await browser.newPage();
		await page.setViewport({width: 800, height: 800});
		await page.goto(`${visualDiff.getBaseUrl()}/test/button/button-subtle.visual-diff.html`, {waitUntil: ['networkidle2', 'load']});
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

	it('with-icon', async function() {
		const rect = await visualDiff.getRect(page, '#with-icon');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('icon-right', async function() {
		const rect = await visualDiff.getRect(page, '#icon-right');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

});
