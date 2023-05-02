import puppeteer from 'puppeteer';
import { VisualDiff } from '@brightspace-ui/visual-diff';

describe('d2l-empty-state-simple', () => {

	const visualDiff = new VisualDiff('empty-state-simple', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch({ headless: 'new' });
		page = await visualDiff.createPage(browser);
		await page.goto(
			`${visualDiff.getBaseUrl()}/components/empty-state/test/empty-state-simple.visual-diff.html`,
			{ waitUntil: ['networkidle0', 'load'] }
		);
		await page.bringToFront();
	});

	beforeEach(async() => await visualDiff.resetFocus(page));

	after(async() => await browser.close());

	['ltr', 'rtl'].forEach(dir => {
		describe(dir, () => {

			before(async() => {
				await page.goto(
					`${visualDiff.getBaseUrl()}/components/empty-state/test/empty-state-simple.visual-diff.html?dir=${dir}`,
					{ waitUntil: ['networkidle0', 'load'] }
				);
				await page.bringToFront();
			});

			[
				'normal',
				'normal-button',
				'normal-button-primary-blocked',
				'normal-link',
				'wrap',
				'wrap-button',
				'wrap-link',
				'no-description-button',
				'no-description-link'
			]
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
