import { focusWithKeyboard, focusWithMouse, VisualDiff } from '@brightspace-ui/visual-diff';
import puppeteer from 'puppeteer';

describe('d2l-button-subtle', () => {

	const visualDiff = new VisualDiff('button-subtle', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);
		await page.goto(`${visualDiff.getBaseUrl()}/components/button/test/button-subtle.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	beforeEach(async() => {
		await visualDiff.resetFocus(page);
	});

	after(async() => await browser.close());

	[
		'default',
		'slim'
	].forEach((type) => {
		describe(type, () => {
			[
				{ category: 'normal', tests: ['normal', 'hover', 'focus', 'click', 'disabled'] },
				{ category: 'icon', tests: ['with-icon', 'with-icon-rtl', 'icon-right', 'icon-right-rtl'] }

			].forEach((entry) => {
				describe(entry.category, () => {
					entry.tests.forEach((name) => {
						it(name, async function() {

							const selector = `#${type}-${entry.category}`;
							if (name === 'hover') {
								await page.hover(selector);
							} else if (name === 'focus') {
								await focusWithKeyboard(page, selector);
							} else if (name === 'click') {
								await focusWithMouse(page, selector);
							}

							const rectId = `${type}-${(name.indexOf('disabled') !== -1 || name.indexOf('icon') !== -1) ? name : entry.category}`;
							const rect = await visualDiff.getRect(page, `#${rectId}`);
							await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });

						});
					});
				});
			});
		});
	});

	it('h-align', async function() {
		const rect = await visualDiff.getRect(page, '#h-align');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });

	});

});
