const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-input-textarea', () => {

	const visualDiff = new VisualDiff('input-textarea', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);
		await page.setViewport({width: 800, height: 1200, deviceScaleFactor: 2});
		await page.goto(`${visualDiff.getBaseUrl()}/components/inputs/test/input-textarea.visual-diff.html`, {waitUntil: ['networkidle0', 'load']});
		await page.bringToFront();
	});

	after(() => browser.close());

	['wc', 'sass'].forEach((type) => {
		[
			'basic',
			'disabled',
			'placeholder',
			'placeholder-disabled',
			'invalid',
			'invalid-disabled',
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

});
