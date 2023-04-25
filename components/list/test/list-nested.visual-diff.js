import puppeteer from 'puppeteer';
import { VisualDiff } from '@brightspace-ui/visual-diff';

describe('d2l-list-nested', () => {

	const visualDiff = new VisualDiff('list-nested', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser, { viewport: { width: 1000, height: 8500 } });
	});

	beforeEach(async() => {
		await visualDiff.resetFocus(page);
		await page.mouse.move(-1, -1);
	});

	after(async() => await browser.close());

	['ltr', 'rtl'].forEach(dir => {
		describe(dir, () => {

			before(async() => {
				await page.goto(`${visualDiff.getBaseUrl()}/components/list/test/list-nested.visual-diff.html?dir=${dir}`, { waitUntil: ['networkidle0', 'load'] });
				await page.bringToFront();
			});

			[
				{ name: 'separate lists all possible combos', selector: '#separate-lists-all-possible-combos' },
				{ name: 'one list all possible combos', selector: '#one-list-all-possible-combos' }
			].forEach((info) => {
				it(info.name, async function() {
					await page.evaluate(() => {
						return new Promise(resolve => setTimeout(resolve, 0));
					});
					const rect = await visualDiff.getRect(page, info.selector);
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});
			});
		});
	});

});
