import puppeteer from 'puppeteer';
import VisualDiff from '@brightspace-ui/visual-diff';

describe('d2l-offscreen', () => {

	const visualDiff = new VisualDiff('offscreen', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);
	});

	after(async() => await browser.close());

	['ltr', 'rtl'].forEach((dir) => {
		describe(dir, () => {
			before(async() => {
				await page.goto(`${visualDiff.getBaseUrl()}/components/offscreen/test/offscreen.visual-diff.html?dir=${dir}`, { waitUntil: ['networkidle0', 'load'] });
				await page.bringToFront();
			});

			[
				'wc',
				'style',
				'sass'
			].forEach((name) => {

				it(name, async function() {
					const rect = await visualDiff.getRect(page, `#${name}`);
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});
			});
		});
	});
});
