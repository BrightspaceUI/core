/*global forceFocusVisible */
import puppeteer from 'puppeteer';
import VisualDiff from '@brightspace-ui/visual-diff';

describe('d2l-collapsible-panel', () => {

	const visualDiff = new VisualDiff('collapsible-panel', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);
		await page.goto(`${visualDiff.getBaseUrl()}/components/collapsible-panel/test/collapsible-panel.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	after(async() => await browser.close());

	[
		'default',
		'default-large-padding',
		'subtle',
		'subtle-large-padding',
		'inline',
		'inline-large-padding',
		'custom',
	].forEach((name) => {
		[true, false].forEach((hasSummary) => {
			const selector = `#${name}${hasSummary ? '-summary' : ''}`;

			[true, false].forEach((expanded) => {
				[true, false].forEach((focused) => {
					it(`${name}${hasSummary ? '-summary' : ''}-${expanded ? 'expanded' : 'collapsed'}${focused ? '-focused' : ''}`, async function() {

						await page.evaluate((selector, expanded, focused) => {
							const elem = document.querySelector(selector).querySelector('d2l-collapsible-panel');

							elem.blur();
							if (focused) { forceFocusVisible(elem); }

							elem.expanded = expanded;
						}, selector, expanded, focused);

						const rect = await visualDiff.getRect(page, selector);
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
					});
				});
			});
		});

	});

});
