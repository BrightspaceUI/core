import { focusWithKeyboard, focusWithMouse, VisualDiff } from '@brightspace-ui/visual-diff';
import puppeteer from 'puppeteer';

describe('d2l-button', () => {

	const visualDiff = new VisualDiff('button', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch({ headless: 'new' });
		page = await visualDiff.createPage(browser);
		await page.goto(`${visualDiff.getBaseUrl()}/components/button/test/button.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	beforeEach(async() => {
		await visualDiff.resetFocus(page);
	});

	after(async() => await browser.close());

	[
		{ category: 'normal', tests: ['normal', 'hover', 'focus', 'click', 'disabled'] },
		{ category: 'primary', tests: ['normal', 'hover', 'focus', 'click', 'primary-disabled'] },
	].forEach((entry) => {
		describe(entry.category, () => {
			entry.tests.forEach((name) => {
				it(name, async function() {

					const selector = `#${entry.category}`;
					if (name === 'hover') {
						await page.hover(selector);
					} else if (name === 'focus') {
						await focusWithKeyboard(page, selector);
					} else if (name === 'click') {
						await focusWithMouse(page, selector);
					}

					const rectId = (name.indexOf('disabled') !== -1) ? name : entry.category;
					const rect = await visualDiff.getRect(page, `#${rectId}`);
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });

				});
			});
		});
	});

});
