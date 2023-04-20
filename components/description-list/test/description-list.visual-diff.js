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
		'stacked',
		'stacked-with-breakpoint',
		'activity-display',
		'bulk-course-import',
		'slotted',
	].forEach((name) => {
		const selector = `#${name}`;
		[
			799,
			599,
			299,
			239,
		].forEach((width) => {
			it(`${name} ${width}`, async function() {
				await page.$eval (selector, async(elem, width)  => {
					elem.style.width = `${width}px`;
					await new Promise(resolve => requestAnimationFrame(resolve));
				}, width);

				const rect = await visualDiff.getRect(page, selector);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});
		});
	});
});
