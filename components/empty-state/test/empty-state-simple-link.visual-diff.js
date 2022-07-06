import puppeteer from 'puppeteer';
import { VisualDiff } from '@brightspace-ui/visual-diff';

describe('d2l-empty-state-simple-link', () => {

	const visualDiff = new VisualDiff('empty-state-simple-link', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);
		await page.goto(
			`${visualDiff.getBaseUrl()}/components/empty-state/test/empty-state-simple-link.visual-diff.html`,
			{ waitUntil: ['networkidle0', 'load'] }
		);
		await page.bringToFront();
	});

	beforeEach(async() => await visualDiff.resetFocus(page));

	after(async() => await browser.close());

	[
		{ category: 'default', tests: [ 'normal', 'link-wrap', 'wrap', 'no-description', 'no-link' ] },
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
