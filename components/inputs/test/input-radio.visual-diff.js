const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-input-radio', () => {

	const visualDiff = new VisualDiff('input-radio', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await browser.newPage();
		await page.setViewport({width: 800, height: 800, deviceScaleFactor: 2});
		await page.goto(`${visualDiff.getBaseUrl()}/components/inputs/test/input-radio.visual-diff.html`, {waitUntil: ['networkidle0', 'load']});
		await page.bringToFront();
	});

	after(() => browser.close());

	beforeEach(async() => {
		await visualDiff.resetFocus(page);
	});

	it('wc-label', async function() {
		const rect = await visualDiff.getRect(page, '#wc-label');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	['wc-solo', 'sass'].forEach((type) => {
		['default', 'disabled', 'invalid'].forEach((state) => {
			['unchecked', 'checked'].forEach((checked) => {

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

});
