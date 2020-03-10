const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-input-text', () => {

	const visualDiff = new VisualDiff('input-text', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await browser.newPage();
		await page.setViewport({width: 800, height: 3600, deviceScaleFactor: 2});
		await page.goto(`${visualDiff.getBaseUrl()}/components/inputs/test/input-text.visual-diff.html`, {waitUntil: ['networkidle0', 'load']});
		await page.bringToFront();
	});

	after(() => browser.close());

	['wc', 'sass'].forEach((type) => {
		[
			'basic',
			'email',
			'number',
			'password',
			'search',
			'tel',
			'url',
			'disabled',
			'placeholder',
			'placeholder-disabled',
			'invalid',
			'invalid-disabled',
			'aria-invalid',
			'aria-invalid-disabled'
		].forEach((name) => {
			const id = `${type}-${name}`;
			it(id, async function() {
				const rect = await visualDiff.getRect(page, `#${id}`);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});
			if (name.indexOf('disabled') === -1) {
				it(`${id}-focus`, async function() {
					await page.$eval(`#${id}`, (elem) => elem.focus());
					const rect = await visualDiff.getRect(page, `#${id}`);
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});
			}
		});
	});

	[
		'wc-labelled',
		'wc-required',
		'wc-label-hidden',
		'wc-override-height',
		'wc-override-padding',
		'wc-icon-left',
		'wc-icon-left-rtl',
		'wc-icon-right',
		'wc-icon-right-rtl',
		'wc-icon-left-label',
		'wc-icon-right-label',
		'wc-icon-left-right',
		'wc-button-icon-left',
		'wc-button-icon-right'
	].forEach((name) => {
		it(name, async function() {
			const rect = await visualDiff.getRect(page, `#${name}`);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
		it(`${name}-focus`, async function() {
			await page.$eval(`#${name}`, (elem) => elem.focus());
			const rect = await visualDiff.getRect(page, `#${name}`);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

});
