import puppeteer from 'puppeteer';
import { VisualDiff } from '@brightspace-ui/visual-diff';

describe('d2l-empty-state-illustrated-button', () => {

	const visualDiff = new VisualDiff('empty-state-illustrated-button', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);
		await page.goto(
			`${visualDiff.getBaseUrl()}/components/empty-state/test/empty-state-illustrated-button.visual-diff.html`,
			{ waitUntil: ['networkidle0', 'load'] }
		);
		await page.bringToFront();
	});

	beforeEach(async() => await visualDiff.resetFocus(page));

	after(async() => await browser.close());

	[ 'normal', 'small', 'primary', 'primary-small', 'custom-svg', 'no-svg', 'no-action' ]
		.forEach(name => {

			it(name, async function() {
				const selector = `#${name}`;
				const rect = await visualDiff.getRect(page, selector);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

		});

});
