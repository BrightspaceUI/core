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
		'subtle',
		'inline',
		'large-padding',
		'custom',
	].forEach((name) => {
		[true, false].forEach((hasSummary) => {
			const selector = `#${name}${hasSummary ? '-summary' : ''}`;

			[true, false].forEach((expanded) => {
				it(`${name} ${expanded}`, async function() {
					const rect = await visualDiff.getRect(page, selector);
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});
			});
		});

	});

});
