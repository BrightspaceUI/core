import puppeteer from 'puppeteer';
import VisualDiff from '@brightspace-ui/visual-diff';

describe('d2l-dl-wrapper', () => {

	const visualDiff = new VisualDiff('description-list', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);
		await page.goto(`${visualDiff.getBaseUrl()}/components/description-list/test/description-list.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	after(async() => await browser.close());

	[
		'default',
		'long',
		'activity-display',
		'bulk-course-import',
		'slotted',
	].forEach((name) => {
		[
			{ name, selector: `#${name}` },
			{ name: `${name} 300px`, selector: `#${name}-300` },
			{ name: `${name} 200px`, selector: `#${name}-200` }
		].forEach((info) => {
			it(info.name, async function() {
				const rect = await visualDiff.getRect(page, info.selector);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});
		});
	});
});
