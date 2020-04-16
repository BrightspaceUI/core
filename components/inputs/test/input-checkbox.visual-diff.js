const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-input-checkbox', () => {

	const visualDiff = new VisualDiff('input-checkbox', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);
		await page.setViewport({width: 800, height: 1300, deviceScaleFactor: 2});
		await page.goto(`${visualDiff.getBaseUrl()}/components/inputs/test/input-checkbox.visual-diff.html`, {waitUntil: ['networkidle0', 'load']});
		await page.bringToFront();
	});

	after(async() => await browser.close());

	['wc', 'sass'].forEach((type) => {
		['default', 'disabled'].forEach((state) => {
			const states = ['checked', 'unchecked'];
			if (type === 'wc') {
				states.push('indeterminate');
			}
			states.forEach((checked) => {
				const id = `${type}-${state}-${checked}`;
				it(id, async function() {
					const rect = await visualDiff.getRect(page, `#${id}`);
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});
				if (state !== 'disabled') {
					it(`${id}-focus`, async function() {
						await page.$eval(`#${id}`, (elem) => elem.focus());
						const rect = await visualDiff.getRect(page, `#${id}`);
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
					});
				}
			});
		});
	});

	[
		'multiline',
		'hidden-label',
		'spacer'
	].forEach((type) => {
		['', '-rtl'].forEach((dir) => {
			const id = `wc-${type}${dir}`;
			it(id, async function() {
				const rect = await visualDiff.getRect(page, `#${id}`);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});
		});
	});

});
