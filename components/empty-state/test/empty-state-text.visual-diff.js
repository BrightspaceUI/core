import puppeteer from 'puppeteer';
import { VisualDiff } from '@brightspace-ui/visual-diff';

describe('d2l-empty-state-text', () => {

	const visualDiff = new VisualDiff('empty-state-text', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);
		await page.goto(
			`${visualDiff.getBaseUrl()}/components/empty-state/test/empty-state-text.visual-diff.html`,
			{ waitUntil: ['networkidle0', 'load'] }
		);
		await page.bringToFront();
	});

	beforeEach(async() => await visualDiff.resetFocus(page));

	after(async() => await browser.close());

	[
		{ category: 'default', tests: [ 'normal', 'button-wrap', 'button-wrap-rtl', 'wrap', 'wrap-rtl', 'no-description', 'no-action' ] },
		{ category: 'custom', tests: ['subtle-button', 'link'] }
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
