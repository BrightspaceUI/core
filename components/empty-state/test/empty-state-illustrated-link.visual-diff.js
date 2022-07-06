import puppeteer from 'puppeteer';
import { VisualDiff } from '@brightspace-ui/visual-diff';

describe('d2l-empty-state-illustrated-link', () => {

	const visualDiff = new VisualDiff('empty-state-illustrated-link', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);
		await page.goto(
			`${visualDiff.getBaseUrl()}/components/empty-state/test/empty-state-illustrated-link.visual-diff.html`,
			{ waitUntil: ['networkidle0', 'load'] }
		);
		await page.bringToFront();
	});

	beforeEach(async() => await visualDiff.resetFocus(page));

	after(async() => await browser.close());

	[
		{ category: 'default', tests: [ 'normal', 'custom-svg', 'no-svg' ] },
	].forEach(entry => {
		describe(entry.category, () => {
			entry.tests.forEach(name => {
				it(name, async function() {
					const selector = `#${entry.category}-${name}`;
					const rect = await visualDiff.getRect(page, selector);
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});
			});
		});
	});

});
