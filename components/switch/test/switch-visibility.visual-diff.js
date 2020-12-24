const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-switch-visibility', () => {

	const visualDiff = new VisualDiff('switch-visibility', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);
	});

	after(async() => await browser.close());

	['ltr', 'rtl'].forEach(dir => {

		describe(dir, () => {

			before(async() => {
				await page.goto(`${visualDiff.getBaseUrl()}/components/switch/test/switch-visibility.visual-diff.html?dir=${dir}`, { waitUntil: ['networkidle0', 'load'] });
				await page.bringToFront();
			});

			[
				{ name: 'off', selector: '#off' },
				{ name: 'on', selector: '#on' }
			].forEach(info => {

				it(info.name, async function() {
					const rect = await visualDiff.getRect(page, info.selector);
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});

			});

		});

	});

});
