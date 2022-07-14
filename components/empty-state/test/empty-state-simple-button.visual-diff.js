import puppeteer from 'puppeteer';
import { VisualDiff } from '@brightspace-ui/visual-diff';

describe('d2l-empty-state-simple-button', () => {

	const visualDiff = new VisualDiff('empty-state-simple-button', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);
	});

	beforeEach(async() => await visualDiff.resetFocus(page));

	after(async() => await browser.close());

	['ltr', 'rtl'].forEach(dir => {
		describe(dir, () => {

			before(async() => {
				await page.goto(
					`${visualDiff.getBaseUrl()}/components/empty-state/test/empty-state-simple-button.visual-diff.html?dir=${dir}`,
					{ waitUntil: ['networkidle0', 'load'] }
				);
				await page.bringToFront();
			});

			[ 'normal', 'button-wrap', 'wrap', 'no-description', 'no-action' ]
				.forEach(name => {
					it(`${name}`, async function() {
						const selector = `#${name}`;
						const rect = await visualDiff.getRect(page, selector);
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
					});
				});

		});

	});

});
